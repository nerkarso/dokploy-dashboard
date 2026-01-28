import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { STATUS_COLORS, TYPE_ICONS } from '@/config/constants';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/dokploy';

interface ServiceTableProps {
	services: Service[];
}

export function ServiceTable({ services }: ServiceTableProps) {
	return (
		<div className="rounded-md border bg-muted/30">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Service</TableHead>
						<TableHead>Project</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Created At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{services.map((service) => {
						const Icon = TYPE_ICONS[service.type];

						return (
							<TableRow key={service.id || service.name}>
								<TableCell className="font-medium">{service.name}</TableCell>
								<TableCell>{service.project.name}</TableCell>
								<TableCell>
									<div className="flex items-center gap-2 capitalize text-muted-foreground">
										{Icon && <Icon size={16} />}
										{service.type}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<div
											className={cn(
												'size-2 rounded-full',
												STATUS_COLORS[service.status] || 'bg-slate-300',
											)}
										/>
										<span className="capitalize">{service.status}</span>
									</div>
								</TableCell>
								<TableCell className="text-right text-muted-foreground whitespace-nowrap">
									{new Date(service.createdAt).toLocaleString()}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
