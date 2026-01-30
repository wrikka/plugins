import type { Plugin } from "vite";

export interface MockRoute {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	path: string;
	response?: unknown;
	responseFn?: () => unknown | Promise<unknown>;
	delay?: number;
	status?: number;
	headers?: Record<string, string>;
}

export interface MockPluginOptions {
	mocks?: MockRoute[];
	openApiPath?: string;
	verbose?: boolean;
	delay?: number;
	enabled?: boolean;
}

export interface MockServer {
	start: () => void;
	stop: () => void;
	addMock: (route: MockRoute) => void;
}
