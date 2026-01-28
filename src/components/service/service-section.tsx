import { ServiceGrid } from '@/components/service/service-grid';
import { ServiceTable } from '@/components/service/service-table';
import type { Service } from '@/types/dokploy';

interface ServiceSectionProps {
	title: string;
	services: Service[];
	filter: { status: string };
	view: 'grid' | 'table';
}

export function ServiceSection({
	title,
	services,
	filter,
	view,
}: ServiceSectionProps) {
	const items = services.filter((service) => service.status === filter.status);

	if (items.length === 0) return null;

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold">{title}</h2>
			{view === 'grid' ? (
				<ServiceGrid services={items} />
			) : (
				<ServiceTable services={items} />
			)}
		</div>
	);
}
