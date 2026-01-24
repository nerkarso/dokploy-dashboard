import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getServices } from '@/server/functions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { CircuitBoardIcon, GlobeIcon } from 'lucide-react';
import { Suspense } from 'react';

export const Route = createFileRoute('/')({
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
			<main className="max-w-screen-2xl mx-auto py-8 px-4">
				<Suspense fallback={null}>
					<ServiceRoot />
				</Suspense>
			</main>
		</>
	);
}

function ServiceRoot() {
	const initialData = Route.useLoaderData();

	const { data } = useSuspenseQuery({
		queryKey: ['services'],
		queryFn: () => getServices(),
		initialData: initialData,
		refetchInterval: 1000,
	});
	const { services } = data;

	return (
		<div className="space-y-8">
			<ServiceList services={services} filter={{ status: 'running' }} />
			<ServiceList services={services} filter={{ status: 'done' }} />
			<ServiceList services={services} filter={{ status: 'error' }} />
			<ServiceList services={services} filter={{ status: 'idle' }} />
		</div>
	);
}

function ServiceList({
	services,
	filter,
}: {
	services: any[];
	filter?: { status?: string };
}) {
	let items = services;

	if (filter?.status) {
		items = services?.filter((service) => service.status === filter?.status);
	}

	if (items.length === 0) return;

	return (
		<div className="grid grid-cols-4 gap-4">
			{items.map((service) => (
				<ServiceCard key={service.id} service={service} />
			))}
		</div>
	);
}

function ServiceCard({ service }: { service: any }) {
	const statusColors: Record<string, string> = {
		done: 'bg-green-500',
		running: 'bg-yellow-500',
		error: 'bg-red-500',
	};

	const typeIcons: Record<string, React.ReactNode> = {
		application: <GlobeIcon size={18} />,
		compose: <CircuitBoardIcon size={18} />,
	};

	return (
		<Card className="bg-muted/30 relative">
			{['done', 'running', 'error'].includes(service.status) && (
				<span
					className={cn(
						'rounded-full size-3 absolute -top-1 -right-1',
						statusColors[service.status],
					)}
				></span>
			)}
			<CardHeader className="flex justify-between gap-2">
				<CardTitle className="leading-normal break-all flex flex-wrap items-center gap-x-2">
					<span>{service.project.name}</span>
					<span className="text-xs text-ring">/</span>
					<span className="">{service.name}</span>
				</CardTitle>
				<span className="text-muted-foreground">{typeIcons[service.type]}</span>
			</CardHeader>
			<CardContent className="mt-auto">
				<span className="text-xs text-muted-foreground">
					{new Date(service.createdAt).toDateString()}
				</span>
			</CardContent>
		</Card>
	);
}
