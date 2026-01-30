import { createHighlighter } from "shiki";
import type { MarkdownParser, MarkdownPlugin, MarkdownRenderOptions } from "./types";

export class WMarkdownRenderer implements MarkdownParser {
	private options: MarkdownRenderOptions;
	private plugins: MarkdownPlugin[] = [];
	private rules: Map<string, (text: string) => string> = new Map();
	private highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

	constructor(options: MarkdownRenderOptions = {}) {
		this.options = {
			enableHighlight: true,
			enableAsync: false,
			enablePlugins: true,
			plugins: [],
			...options,
		};

		this.initializeDefaultRules();

		if (this.options.enablePlugins && this.options.plugins) {
			this.options.plugins.forEach(plugin => this.use(plugin));
		}
	}

	private async initializeHighlighter(): Promise<void> {
		if (this.highlighter) return;

		const shikiOptions = this.options.shikiOptions || {
			themes: ["github-dark"],
			langs: ["javascript", "typescript", "css", "html", "json", "markdown", "bash"],
		};

		this.highlighter = await createHighlighter({
			themes: shikiOptions.themes || ["github-dark"],
			langs: shikiOptions.langs || ["javascript", "typescript", "css", "html", "json", "markdown", "bash"],
		});
	}

	private initializeDefaultRules(): void {
		this.rules.set("headers", (text: string) => {
			return text.replace(/^#{1,6}\s+(.+)$/gm, (_, content, offset, string) => {
				const level = string[offset].length;
				return `<h${level}>${this.parseInline(content)}</h${level}>`;
			});
		});

		this.rules.set("bold", (text: string) => {
			return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
		});

		this.rules.set("italic", (text: string) => {
			return text.replace(/\*(.+?)\*/g, "<em>$1</em>");
		});

		this.rules.set("code", (text: string) => {
			return text.replace(/`([^`]+)`/g, "<code>$1</code>");
		});

		this.rules.set("code_block", async (text: string) => {
			return text.replace(/```(\w+)?\n([\s\S]+?)```/g, async (match, lang, code) => {
				if (this.options.enableHighlight && this.options.highlightOptions?.highlight) {
					const result = this.options.highlightOptions.highlight(code.trim(), lang || "");
					if (result instanceof Promise) {
						return `<pre><code class="language-${lang || "text"}">${code.trim()}</code></pre>`;
					}
					return result;
				}

				if (this.options.enableHighlight && this.highlighter) {
					try {
						const html = this.highlighter.codeToHtml(code.trim(), {
							lang: lang || "text",
							theme: this.options.shikiOptions?.theme || "github-dark",
						});
						return html;
					} catch (error) {
						return `<pre><code class="language-${lang || "text"}">${this.escapeHtml(code.trim())}</code></pre>`;
					}
				}

				return `<pre><code class="language-${lang || "text"}">${this.escapeHtml(code.trim())}</code></pre>`;
			});
		});

		this.rules.set("link", (text: string) => {
			return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\">$1</a>");
		});

		this.rules.set("image", (text: string) => {
			return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "<img src=\"$2\" alt=\"$1\">");
		});

		this.rules.set("blockquote", (text: string) => {
			return text.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");
		});

		this.rules.set("list", (text: string) => {
			const ulRegex = /^(\s*)[-*+]\s+(.+)$/gm;
			const olRegex = /^(\s*)\d+\.\s+(.+)$/gm;

			text = text.replace(ulRegex, (_, indent, content) => {
				return `${indent}<li>${this.parseInline(content)}</li>`;
			});

			text = text.replace(olRegex, (_, indent, content) => {
				return `${indent}<li>${this.parseInline(content)}</li>`;
			});

			return text;
		});

		this.rules.set("paragraph", (text: string) => {
			return text.replace(/^(?!<[a-z]).+$/gm, (line) => {
				if (line.trim() === "") return "";
				if (line.startsWith("<")) return line;
				return `<p>${line}</p>`;
			});
		});
	}

	private parseInline(text: string): string {
		text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
		text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
		text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
		text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\">$1</a>");
		return text;
	}

	private escapeHtml(text: string): string {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	async render(markdown: string): Promise<string> {
		if (this.options.enableHighlight && !this.highlighter) {
			await this.initializeHighlighter();
		}

		let html = markdown;

		for (const [name, rule] of this.rules) {
			const result = rule(html);
			if (result instanceof Promise) {
				html = await result;
			} else {
				html = result;
			}
		}

		return html;
	}

	async renderAsync(markdown: string): Promise<string> {
		if (!this.options.enableAsync) {
			return this.render(markdown);
		}

		if (this.options.enableHighlight && !this.highlighter) {
			await this.initializeHighlighter();
		}

		let html = markdown;

		for (const [name, rule] of this.rules) {
			const result = rule(html);
			if (result instanceof Promise) {
				html = await result;
			} else {
				html = result;
			}
		}

		return html;
	}

	use(plugin: MarkdownPlugin): void {
		if (!this.plugins.find(p => p.name === plugin.name)) {
			this.plugins.push(plugin);
			plugin.install(this);
		}
	}

	getPlugins(): MarkdownPlugin[] {
		return [...this.plugins];
	}

	addRule(name: string, rule: (text: string) => string): void {
		this.rules.set(name, rule);
	}

	removeRule(name: string): void {
		this.rules.delete(name);
	}
}
