import { projectAll } from '@/lib/dokploy';
import { createServerFn } from '@tanstack/react-start';
import _ from 'lodash';

export const getServices = createServerFn().handler(async () => {
	const projects: any[] = [];
	let services: any[] = [];

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
					name: application.name,
					type: 'application',
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
					name: compose.name,
					type: 'compose',
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

	services = _.sortBy(services, 'project.name', 'name');

	return {
		projects,
		services,
	};
});
