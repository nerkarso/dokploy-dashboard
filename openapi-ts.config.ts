import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
	input: {
		path: `${process.env.DOKPLOY_URL}/api/settings.getOpenApiDocument`,
		fetch: {
			headers: {
				Cookie: `better-auth.session_token=${process.env.DOKPLOY_ADMIN_TOKEN}`,
			},
		},
	},
	output: 'src/lib/dokploy',
	plugins: [
		{
			name: '@hey-api/client-fetch',
			runtimeConfigPath: '../../config/hey-api.ts',
		},
	],
});
