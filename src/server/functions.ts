import {
	applicationOne,
	composeOne,
	deploymentAll,
	deploymentAllByCompose,
	projectAll,
} from '@/lib/dokploy';
import {
	type Deployment,
	type DokployProject,
	type Project,
	type Service,
	ServiceStatus,
	ServiceType,
} from '@/types/dokploy';
import { createServerFn } from '@tanstack/react-start';
import _ from 'lodash';

export const getServices = createServerFn().handler(async () => {
	const projects: Project[] = [];
	let services: Service[] = [];

	const projectsRes = await projectAll();
	const projectsData = projectsRes.data as DokployProject[] | undefined;
	projectsData?.forEach((project) => {
		projects.push({
			id: project?.projectId,
			name: project?.name,
		});
		project?.environments?.forEach((env) => {
			env?.applications?.forEach((application) => {
				services.push({
					id: application?.applicationId,
					name: application?.name,
					type: ServiceType.APPLICATION,
					status: application?.applicationStatus,
					createdAt: project?.createdAt as unknown as string,
					// domains: application.domains.map((domain) => {
					// 	return [domain.https ? 'https' : 'http', '://', domain.host].join(
					// 		'',
					// 	);
					// }),
					domains: [],
					project: {
						id: project?.projectId,
						name: project?.name,
					},
				});
			});
			env?.compose?.forEach((compose) => {
				services.push({
					id: compose?.composeId,
					name: compose?.name,
					type: ServiceType.COMPOSE,
					status: compose?.composeStatus,
					createdAt: project?.createdAt as unknown as string,
					// domains: compose.domains.map((domain) => {
					// 	return [domain.https ? 'https' : 'http', '://', domain.host].join(
					// 		'',
					// 	);
					// }),
					domains: [],
					project: {
						id: project?.projectId,
						name: project?.name,
					},
				});
			});
		});
	});

	const statusOrder = [
		ServiceStatus.RUNNING,
		ServiceStatus.ERROR,
		ServiceStatus.DONE,
		ServiceStatus.IDLE,
	];
	services = _.orderBy(
		services,
		[
			(s) => statusOrder.indexOf(s.status as ServiceStatus),
			'project.name',
			'name',
		],
		['asc', 'asc', 'asc'],
	);

	const servicePromises = services.map((s) => {
		if (s.type === ServiceType.APPLICATION) {
			return applicationOne({ query: { applicationId: s.id } });
		} else if (s.type === ServiceType.COMPOSE) {
			return composeOne({ query: { composeId: s.id } });
		} else {
			return Promise.resolve(null);
		}
	});

	const serviceResults = await Promise.all(servicePromises);

	serviceResults.forEach((res, index) => {
		if (res?.data) {
			const data = res.data as unknown as
				| {
						domains: Array<{ https: boolean; host: string }>;
				  }
				| undefined;
			if (data?.domains) {
				services[index].domains = data.domains.map((domain) => {
					return [domain.https ? 'https' : 'http', '://', domain.host].join('');
				});
			}
		}
	});

	return {
		projects,
		services,
	};
});

export const getDeployments = createServerFn()
	.inputValidator((data: { serviceId: string; serviceType: string }) => data)
	.handler(async ({ data }): Promise<Deployment[]> => {
		try {
			let response: { data?: unknown; error?: unknown };

			if (data.serviceType === ServiceType.COMPOSE) {
				response = await deploymentAllByCompose({
					query: { composeId: data.serviceId },
				});
			} else {
				response = await deploymentAll({
					query: { applicationId: data.serviceId },
				});
			}

			if (response.error) {
				console.error('Error fetching deployments:', response.error);
				return [];
			}

			const deployments = response.data as
				| Array<{
						deploymentId: string;
						title: string | null;
						status: string;
						logPath: string;
						createdAt: string;
						description?: string | null;
				  }>
				| undefined;
			if (!deployments) {
				return [];
			}

			return deployments.map((d) => ({
				deploymentId: d.deploymentId,
				title: d.title,
				status: d.status,
				logPath: d.logPath,
				createdAt: d.createdAt,
				description: d.description,
			}));
		} catch (error) {
			console.error('Failed to fetch deployments:', error);
			return [];
		}
	});
