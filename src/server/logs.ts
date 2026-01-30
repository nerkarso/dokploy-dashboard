import { env } from '@/env';
import { createServerFn } from '@tanstack/react-start';
import WebSocket from 'ws';

export const streamDeploymentLogs = createServerFn()
	.inputValidator((data: { logPath: string }) => data)
	.handler(async ({ data }) => {
		const { logPath } = data;
		let ws: WebSocket | null = null;

		const stream = new ReadableStream({
			start(controller) {
				ws = new WebSocket(
					`${env.DOKPLOY_URL.replace('http', 'ws')}/listen-deployment?logPath=${encodeURIComponent(logPath)}`,
					{
						headers: {
							'x-api-key': env.DOKPLOY_API_KEY,
						},
					},
				);

				const encoder = new TextEncoder();

				ws.on('open', () => {
					// connected
				});

				ws.on('message', (data) => {
					controller.enqueue(encoder.encode(data.toString()));
				});

				ws.on('error', (err) => {
					try {
						controller.enqueue(encoder.encode(`Error: ${err.message}`));
						controller.close();
					} catch (e) {
						// ignore
					}
				});

				ws.on('close', () => {
					try {
						controller.close();
					} catch (e) {
						// ignore
					}
				});
			},
			cancel() {
				if (ws && ws.readyState === WebSocket.OPEN) {
					ws.close();
				}
			},
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			},
		});
	});
