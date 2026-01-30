import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { streamDeploymentLogs } from '@/server/logs';
import { Loader2Icon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface DeploymentLogsDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	logPath: string;
	deploymentTitle: string;
}

export function DeploymentLogsDrawer({
	open,
	onOpenChange,
	logPath,
	deploymentTitle,
}: DeploymentLogsDrawerProps) {
	const [logs, setLogs] = useState<string[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [autoScroll, setAutoScroll] = useState(true);
	const logsEndRef = useRef<HTMLDivElement>(null);
	const logsContainerRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		if (autoScroll && logsEndRef.current) {
			logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [autoScroll]);

	const handleScroll = useCallback(() => {
		if (!logsContainerRef.current) return;

		const container = logsContainerRef.current;
		const isAtBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight <
			50;
		setAutoScroll(isAtBottom);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: scrollToBottom when logs array changes
	useEffect(() => {
		scrollToBottom();
	}, [logs.length, scrollToBottom]);

	useEffect(() => {
		if (!open || !logPath) {
			return;
		}

		setLogs([]);
		setIsConnecting(true);

		let isCancelled = false;

		const connect = async () => {
			try {
				const response = await streamDeploymentLogs({
					data: { logPath },
				});

				if (!response.body) {
					throw new Error('No response body');
				}

				setIsConnected(true);
				setIsConnecting(false);

				const reader = response.body.getReader();
				const decoder = new TextDecoder();

				while (!isCancelled) {
					const { done, value } = await reader.read();
					if (done) break;

					const text = decoder.decode(value);
					if (text && text.trim()) {
						setLogs((prev) => [...prev, text]);
					}
				}
			} catch (err: any) {
				if (!isCancelled) {
					setIsConnecting(false);
					setLogs((prev) => [...prev, '❌ Connection error or stream ended']);
				}
			} finally {
				if (!isCancelled) {
					setIsConnected(false);
					setIsConnecting(false);
				}
			}
		};

		connect();

		return () => {
			isCancelled = true;
		};
	}, [open, logPath]);

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="right">
			<DrawerContent className="data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-3xl">
				<DrawerHeader>
					<div className="flex justify-between gap-2">
						<div className="space-y-1.5">
							<DrawerTitle className="flex items-center gap-2">
								Deployment Logs
								{isConnected && (
									<span className="size-2 rounded-full bg-green-500" />
								)}
								{isConnecting && (
									<Loader2Icon className="size-4 animate-spin text-muted-foreground" />
								)}
							</DrawerTitle>
							{deploymentTitle && (
								<DrawerDescription className="break-all">
									{deploymentTitle}
								</DrawerDescription>
							)}
						</div>
						<DrawerClose asChild>
							<Button variant="ghost" size="icon-sm">
								<XIcon className="size-5" />
							</Button>
						</DrawerClose>
					</div>
				</DrawerHeader>

				<div className="flex-1 min-h-0 border-t">
					<div
						ref={logsContainerRef}
						onScroll={handleScroll}
						className="p-4 font-mono text-xs bg-zinc-950 rounded-lg h-full overflow-auto"
					>
						{logs.length === 0 && !isConnecting && (
							<div className="text-muted-foreground text-center py-8">
								{isConnected
									? 'Waiting for logs...'
									: 'Connecting to log stream...'}
							</div>
						)}
						{logs.map((log, index) => (
							<div
								key={`${index}-${log.slice(0, 20)}`}
								className={cn('whitespace-pre-wrap break-all py-0.5')}
							>
								{log}
							</div>
						))}
						<div ref={logsEndRef} />
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
