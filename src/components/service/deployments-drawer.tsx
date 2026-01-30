import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { DEPLOYMENT_STATUS_STYLES } from '@/config/constants';
import { cn } from '@/lib/utils';
import { getDeployments } from '@/server/functions';
import {
	type Deployment,
	DeploymentStatus,
	type Service,
} from '@/types/dokploy';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ChevronRightIcon, RefreshCwIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { DeploymentLogsDrawer } from './deployment-logs-drawer';

dayjs.extend(relativeTime);

interface DeploymentsDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	service: Service;
}

export function DeploymentsDrawer({
	open,
	onOpenChange,
	service,
}: DeploymentsDrawerProps) {
	const [selectedDeployment, setSelectedDeployment] =
		useState<Deployment | null>(null);
	const [logsOpen, setLogsOpen] = useState(false);

	const {
		data: deployments = [],
		isLoading,
		error,
		refetch,
		isFetching,
	} = useQuery({
		queryKey: ['deployments', service.id, service.type],
		queryFn: () =>
			getDeployments({
				data: {
					serviceId: service.id,
					serviceType: service.type,
				},
			}),
		enabled: open,
		staleTime: 30 * 1000, // 30 seconds
	});

	const handleViewLogs = (deployment: Deployment) => {
		setSelectedDeployment(deployment);
		setLogsOpen(true);
	};

	return (
		<>
			<Drawer open={open} onOpenChange={onOpenChange} direction="right">
				<DrawerContent className="data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-xl">
					<DrawerHeader>
						<div className="flex justify-between gap-2">
							<div className="space-y-1.5">
								<DrawerTitle>Deployments</DrawerTitle>
								<DrawerDescription>
									See the last 10 deployments for{' '}
									<span className="font-bold">{service.name}</span>
								</DrawerDescription>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => refetch()}
									disabled={isFetching}
								>
									<RefreshCwIcon
										className={cn('size-4', isFetching && 'animate-spin')}
									/>
								</Button>
								<DrawerClose asChild>
									<Button variant="ghost" size="icon-sm">
										<XIcon className="size-5" />
									</Button>
								</DrawerClose>
							</div>
						</div>
					</DrawerHeader>

					<div className="p-4 space-y-2 overflow-y-auto">
						{isLoading && deployments.length === 0 && (
							<div className="space-y-3">
								{[1, 2, 3, 4, 5].map((i) => (
									<DeploymentSkeleton key={i} />
								))}
							</div>
						)}

						{error && (
							<div className="text-center py-8 text-destructive">
								{error.message}
							</div>
						)}

						{!isLoading && !error && deployments.length === 0 && (
							<div className="text-center py-8 text-muted-foreground">
								No deployments found
							</div>
						)}

						{deployments.map((deployment) => (
							<DeploymentCard
								key={deployment.deploymentId}
								deployment={deployment}
								onViewLogs={() => handleViewLogs(deployment)}
							/>
						))}
					</div>
				</DrawerContent>
			</Drawer>

			{selectedDeployment && (
				<DeploymentLogsDrawer
					open={logsOpen}
					onOpenChange={setLogsOpen}
					logPath={selectedDeployment.logPath}
					deploymentTitle={
						selectedDeployment.title || selectedDeployment.deploymentId
					}
				/>
			)}
		</>
	);
}

function DeploymentCard({
	deployment,
	onViewLogs,
}: {
	deployment: Deployment;
	onViewLogs: () => void;
}) {
	const statusStyle =
		DEPLOYMENT_STATUS_STYLES[deployment.status] ||
		DEPLOYMENT_STATUS_STYLES[DeploymentStatus.RUNNING];

	const displayTitle = deployment.title || 'Deployment';

	return (
		<button
			type="button"
			className="w-full cursor-pointer text-left flex items-center gap-2 border rounded-xl p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
			onClick={onViewLogs}
		>
			<div className="flex-1 space-y-1.5 overflow-hidden">
				<div className="flex items-center justify-between gap-2">
					<Badge
						variant="outline"
						className={cn('uppercase font-semibold', statusStyle)}
					>
						{deployment.status}
					</Badge>
					<span className="text-xs text-muted-foreground">
						{dayjs(deployment.createdAt).fromNow()}
						<span className="mx-1">&bull;</span>
						{dayjs(deployment.createdAt).format('HH:mm')}
					</span>
				</div>
				<div className="text-sm font-medium truncate">{displayTitle}</div>
				{deployment.description && (
					<p className="text-xs text-muted-foreground mt-1 truncate">
						{deployment.description}
					</p>
				)}
			</div>
			<div className="shrink-0 pl-2">
				<ChevronRightIcon size={16} className="text-muted-foreground" />
			</div>
		</button>
	);
}

function DeploymentSkeleton() {
	return (
		<div className="border rounded-lg p-3 bg-muted/30">
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-16" />
						<Skeleton className="h-4 w-24" />
					</div>
					<Skeleton className="h-4 w-32" />
				</div>
				<Skeleton className="h-8 w-16" />
			</div>
		</div>
	);
}
