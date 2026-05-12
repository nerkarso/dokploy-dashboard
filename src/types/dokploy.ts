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

export type DokployProject = {
	projectId: string;
	name: string;
	description: string;
	createdAt: Date;
	organizationId: string;
	env: string;
	environments: Environment[];
	projectTags: any[];
};

export type Environment = {
	name: string;
	environmentId: string;
	isDefault: boolean;
	applications: Application[];
	mariadb: any[];
	mongo: any[];
	mysql: Mysql[];
	postgres: any[];
	redis: any[];
	compose: Compose[];
	libsql: any[];
};

export type Application = {
	applicationId: string;
	name: string;
	applicationStatus: ServiceStatus;
};

export type Compose = {
	composeId: string;
	name: string;
	composeStatus: ServiceStatus;
};

export type Mysql = {
	mysqlId: string;
};
