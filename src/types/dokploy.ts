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
	type: ServiceType | (string & {});
	status: ServiceStatus | (string & {});
	createdAt: string;
	project: {
		id: string;
		name: string;
	};
	domains: string[];
};
