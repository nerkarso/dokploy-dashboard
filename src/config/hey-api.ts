import { env } from '@/env';
import type { CreateClientConfig } from '@/lib/dokploy/client.gen';

export const createClientConfig: CreateClientConfig = (config) => ({
	...config,
	baseURL: `${env.DOKPLOY_URL}/api`,
	headers: {
		'x-api-key': env.DOKPLOY_API_KEY,
	},
});
