import { ServiceStatus, ServiceType } from '@/types/dokploy';
import { CircuitBoardIcon, GlobeIcon, type LucideIcon } from 'lucide-react';

export const STATUS_COLORS: Record<ServiceStatus | (string & {}), string> = {
	[ServiceStatus.DONE]: 'bg-green-500',
	[ServiceStatus.RUNNING]: 'bg-yellow-500',
	[ServiceStatus.ERROR]: 'bg-red-500',
	[ServiceStatus.IDLE]: 'bg-slate-500',
};

export const TYPE_ICONS: Record<ServiceType | (string & {}), LucideIcon> = {
	[ServiceType.APPLICATION]: GlobeIcon,
	[ServiceType.COMPOSE]: CircuitBoardIcon,
};
