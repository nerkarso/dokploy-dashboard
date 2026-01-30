import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Service } from '@/types/dokploy';
import { Link2Icon, RocketIcon } from 'lucide-react';
import { useState } from 'react';
import { DeploymentsDrawer } from './deployments-drawer';

interface ServiceActionsProps {
	service: Service;
}

export function ServiceActions({ service }: ServiceActionsProps) {
	const [deploymentsOpen, setDeploymentsOpen] = useState(false);

	return (
		<div className="flex gap-2 justify-end">
			{service.domains && service.domains.length > 0 && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon-sm" className="size-7">
							<Link2Icon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-full max-w-60">
						{service.domains.map((domain) => (
							<DropdownMenuItem
								key={domain}
								onClick={() => window.open(domain, '_blank')}
								className="overflow-hidden"
							>
								<span className="truncate">{domain}</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
			<Button
				variant="ghost"
				size="icon-sm"
				className="size-7"
				onClick={() => setDeploymentsOpen(true)}
			>
				<RocketIcon />
			</Button>

			<DeploymentsDrawer
				open={deploymentsOpen}
				onOpenChange={setDeploymentsOpen}
				service={service}
			/>
		</div>
	);
}
