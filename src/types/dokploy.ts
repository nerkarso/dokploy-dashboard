export type ContainerData = {
	containerId: string;
	name: string;
	image: string;
	ports: string;
	state: string;
	status: string;
};

export type Project = {
	id: string;
	name: string;
};

export enum ServiceStatus {
	RUNNING = 'running',
	DONE = 'done',
	ERROR = 'error',
	IDLE = 'idle',
}

export enum ServiceType {
	APPLICATION = 'application',
	COMPOSE = 'compose',
}

export type Service = {
	id: string;
	name: string;
	appName?: string;
	type: ServiceType | (string & {});
	status: ServiceStatus | (string & {});
	createdAt: string;
	project: {
		id: string;
		name: string;
	};
	domains: string[];
};

export enum DeploymentStatus {
	RUNNING = 'running',
	DONE = 'done',
	ERROR = 'error',
}

export type Deployment = {
	deploymentId: string;
	title: string | null;
	status: DeploymentStatus | (string & {});
	logPath: string;
	createdAt: string;
	description?: string | null;
};
