import { ServiceSection } from '@/components/service/service-section';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { getServices } from '@/server/functions';
import type { Service } from '@/types/dokploy';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { Suspense } from 'react';
import { z } from 'zod';

const serviceSearchSchema = z.object({
	view: z.enum(['grid', 'table']).default('grid'),
});

type ServiceSearch = z.infer<typeof serviceSearchSchema>;

export const Route = createFileRoute('/')({
	validateSearch: (search): ServiceSearch => serviceSearchSchema.parse(search),
	component: RouteComponent,
	loader: () => getServices(),
});

function RouteComponent() {
	return (
		<>
			<header className="h-16 border-b">
				<div className="max-w-screen-2xl mx-auto px-4 flex items-center h-full">
					<div className="flex items-center gap-x-2">
						<img src="/img/icon.svg" alt="" className="size-6" />
						<p className="text-lg font-semibold">Dokploy</p>
					</div>
				</div>
			</header>
			<main className="max-w-screen-2xl mx-auto py-6 px-4">
				<Suspense fallback={null}>
					<ServiceRoot />
				</Suspense>
			</main>
		</>
	);
}

function ServiceRoot() {
	const initialData = Route.useLoaderData();
	const { view } = Route.useSearch() as ServiceSearch;
	const navigate = Route.useNavigate();

	const { data } = useSuspenseQuery({
		queryKey: ['services'],
		queryFn: () => getServices(),
		initialData: initialData,
		refetchInterval: 1000,
	});
	const { services } = data as { services: Service[] };

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<ButtonGroup>
					<Button
						variant={view === 'grid' ? 'outline' : 'secondary'}
						size="icon"
						onClick={() =>
							navigate({
								search: (prev: ServiceSearch) => ({ ...prev, view: 'grid' }),
							})
						}
					>
						<LayoutGridIcon className="size-4" />
					</Button>
					<Button
						variant={view === 'table' ? 'outline' : 'secondary'}
						size="icon"
						onClick={() =>
							navigate({
								search: (prev: ServiceSearch) => ({ ...prev, view: 'table' }),
							})
						}
					>
						<ListIcon className="size-4" />
					</Button>
				</ButtonGroup>
			</div>
			<div className="space-y-8">
				<ServiceSection
					title="Building"
					services={services}
					filter={{ status: 'running' }}
					view={view}
				/>
				<ServiceSection
					title="Running"
					services={services}
					filter={{ status: 'done' }}
					view={view}
				/>
				<ServiceSection
					title="Error"
					services={services}
					filter={{ status: 'error' }}
					view={view}
				/>
				<ServiceSection
					title="Stopped"
					services={services}
					filter={{ status: 'idle' }}
					view={view}
				/>
			</div>
		</div>
	);
}
