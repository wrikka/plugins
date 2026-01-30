import type { Plugin } from "vite";

export interface PreviewPluginOptions {
	enabled?: boolean;
	verbose?: boolean;
	port?: number;
	host?: string;
	open?: boolean;
}
