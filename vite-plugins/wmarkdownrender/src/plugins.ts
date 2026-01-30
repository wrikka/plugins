import type { MarkdownPlugin } from './types';

export class PluginManager {
	private plugins: Map<string, MarkdownPlugin> = new Map();

	register(plugin: MarkdownPlugin): void {
		if (!this.plugins.has(plugin.name)) {
			this.plugins.set(plugin.name, plugin);
		}
	}

	unregister(name: string): void {
		this.plugins.delete(name);
	}

	get(name: string): MarkdownPlugin | undefined {
		return this.plugins.get(name);
	}

	getAll(): MarkdownPlugin[] {
		return Array.from(this.plugins.values());
	}

	has(name: string): boolean {
		return this.plugins.has(name);
	}

	clear(): void {
		this.plugins.clear();
	}
}

export function createPlugin(name: string, installFn: (parser: import('./renderer').WMarkdownRenderer) => void): MarkdownPlugin {
	return {
		name,
		install: installFn,
	};
}
