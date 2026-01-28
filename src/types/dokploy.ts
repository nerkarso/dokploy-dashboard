export type ContainerData = {
	containerId: string;
	name: string;
	image: string;
	ports: string;
	state: string;
	status: string;
};

export type Service = {
	id: string;
	name: string;
	type: 'application' | 'compose';
	status: 'running' | 'done' | 'error' | 'idle' | (string & {});
	createdAt: string;
	project: {
		id: string;
		name: string;
	};
};
