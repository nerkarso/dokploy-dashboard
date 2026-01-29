import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STATUS_COLORS, TYPE_ICONS } from '@/config/constants';
import { cn } from '@/lib/utils';
import { type Service, ServiceStatus } from '@/types/dokploy';
import { ServiceActions } from './service-actions';

interface ServiceGridProps {
	services: Service[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{services.map((service) => (
				<ServiceCard key={service.id || service.name} service={service} />
			))}
		</div>
	);
}

function ServiceCard({ service }: { service: Service }) {
	const Icon = TYPE_ICONS[service.type];

	return (
		<Card className="bg-muted/30 relative flex flex-col">
			{[
				ServiceStatus.DONE,
				ServiceStatus.RUNNING,
				ServiceStatus.ERROR,
			].includes(service.status as ServiceStatus) && (
				<span
					className={cn(
						'rounded-full size-3 absolute -top-1 -right-1 z-10',
						STATUS_COLORS[service.status],
					)}
				></span>
			)}
			<CardHeader className="flex flex-row items-start justify-between space-y-0">
				<CardTitle className="leading-normal break-all flex flex-wrap items-center gap-x-2">
					<span>{service.project.name}</span>
					<span className="text-xs text-ring">/</span>
					<span>{service.name}</span>
				</CardTitle>
				{Icon && <Icon size={18} className="text-muted-foreground shrink-0" />}
			</CardHeader>
			<CardContent className="mt-auto flex items-end justify-between gap-2">
				<span className="text-xs text-muted-foreground">
					{new Date(service.createdAt).toDateString()}
				</span>
				<div className="-mb-2">
					<ServiceActions service={service} />
				</div>
			</CardContent>
		</Card>
	);
}
