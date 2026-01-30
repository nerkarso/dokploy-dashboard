import {
	deploymentAll,
	deploymentAllByCompose,
	projectAll,
} from '@/lib/dokploy';
import {
	type Deployment,
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
	const projectsData = projectsRes.data as any[];
	projectsData?.forEach((project) => {
		projects.push({
			id: project.projectId,
			name: project.name,
		});
		project.environments.forEach((env: any) => {
			env.applications.forEach((application: any) => {
				services.push({
					id: application.applicationId,
					name: application.name,
					type: ServiceType.APPLICATION,
					status: application.applicationStatus,
					createdAt: application.createdAt,
					domains: application.domains.map((domain: any) => {
						return [domain.https ? 'https' : 'http', '://', domain.host].join(
							'',
						);
					}),
					project: {
						id: project.projectId,
						name: project.name,
					},
				});
			});
			env.compose.forEach((compose: any) => {
				services.push({
					id: compose.composeId,
					name: compose.name,
					type: ServiceType.COMPOSE,
					status: compose.composeStatus,
					createdAt: compose.createdAt,
					domains: compose.domains.map((domain: any) => {
						return [domain.https ? 'https' : 'http', '://', domain.host].join(
							'',
						);
					}),
					project: {
						id: project.projectId,
						name: project.name,
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
