import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Service } from '@/types/dokploy';
import { MoreHorizontal } from 'lucide-react';

interface ServiceActionsProps {
	service: Service;
}

export function ServiceActions({ service }: ServiceActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon-sm" className="size-6">
					<MoreHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{service.domains && service.domains.length > 0 ? (
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Domains</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								{service.domains.map((domain) => (
									<DropdownMenuItem
										key={domain}
										onClick={() => window.open(domain, '_blank')}
									>
										{domain}
									</DropdownMenuItem>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				) : (
					<DropdownMenuItem disabled>No domains</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
