import { DeploymentStatus, ServiceStatus, ServiceType } from '@/types/dokploy';
import { CircuitBoardIcon, GlobeIcon, type LucideIcon } from 'lucide-react';

export const STATUS_COLORS: Record<ServiceStatus | (string & {}), string> = {
	[ServiceStatus.DONE]: 'bg-green-500',
	[ServiceStatus.RUNNING]: 'bg-yellow-500',
	[ServiceStatus.ERROR]: 'bg-red-500',
	[ServiceStatus.IDLE]: 'bg-slate-500',
};

export const DEPLOYMENT_STATUS_STYLES: Record<
	DeploymentStatus | (string & {}),
	string
> = {
	[DeploymentStatus.DONE]: 'bg-green-500/15 text-green-600 border-green-500/30',
	[DeploymentStatus.RUNNING]:
		'bg-yellow-500/15 text-yellow-600 border-yellow-500/30',
	[DeploymentStatus.ERROR]: 'bg-red-500/15 text-red-600 border-red-500/30',
};

export const TYPE_ICONS: Record<ServiceType | (string & {}), LucideIcon> = {
	[ServiceType.APPLICATION]: GlobeIcon,
	[ServiceType.COMPOSE]: CircuitBoardIcon,
};
