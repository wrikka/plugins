export interface MarkdownRenderOptions {
	enableHighlight?: boolean;
	enableAsync?: boolean;
	enablePlugins?: boolean;
	plugins?: MarkdownPlugin[];
	highlightOptions?: HighlightOptions;
	shikiOptions?: ShikiOptions;
	twoslashOptions?: TwoslashOptions;
}

export interface HighlightOptions {
	lang?: string;
	highlight?: (code: string, lang: string) => string | Promise<string>;
}

export interface ShikiOptions {
	themes?: string[];
	langs?: string[];
	theme?: string;
}

export interface TwoslashOptions {
	enabled?: boolean;
	renderer?: "rich" | "classic" | "floating-vue";
}

export interface MarkdownPlugin {
	name: string;
	install: (parser: MarkdownParser) => void;
}

export interface RenderResult {
	html: string;
	meta?: Record<string, unknown>;
}

export interface MarkdownParser {
	render: (markdown: string) => string | Promise<string>;
	renderAsync?: (markdown: string) => Promise<string>;
	use: (plugin: MarkdownPlugin) => void;
}

export interface VitePluginOptions {
	extensions?: string[];
	include?: RegExp | RegExp[];
	exclude?: RegExp | RegExp[];
	transformOptions?: MarkdownRenderOptions;
}
