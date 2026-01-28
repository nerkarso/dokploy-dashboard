import { CircuitBoardIcon, GlobeIcon, type LucideIcon } from 'lucide-react';

export const STATUS_COLORS: Record<string, string> = {
	done: 'bg-green-500',
	running: 'bg-yellow-500',
	error: 'bg-red-500',
	idle: 'bg-slate-500',
};

export const TYPE_ICONS: Record<string, LucideIcon> = {
	application: GlobeIcon,
	compose: CircuitBoardIcon,
};
