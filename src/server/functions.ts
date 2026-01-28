import { projectAll } from '@/lib/dokploy';
import {
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
