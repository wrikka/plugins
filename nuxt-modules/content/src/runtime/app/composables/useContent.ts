import { useAsyncData } from "nuxt/app";
import type { ContentItem, QueryBuilder } from "../../shared/types";

function normalizePath(path: string) {
	if (!path) return "/" as const;
	return path.startsWith("/") ? path : `/${path}`;
}

function isPathMatch(itemPath: string | undefined, queryPath: string) {
	if (!itemPath) return false;
	const p = normalizePath(queryPath);
	if (p === "/") return true;
	return itemPath === p || itemPath.startsWith(`${p}/`);
}

function isOnePathMatch(itemPath: string | undefined, queryPath: string) {
	if (!itemPath) return false;
	const p = normalizePath(queryPath);
	return itemPath === p || itemPath === `${p}/index`;
}

export function queryContent(path: string): QueryBuilder {
	return {
		where: (query: any) => {
			return {
				where: (query: any) => {
					return queryContent(path).where(query);
				},
				find: async () => {
					const { data } = await useAsyncData<ContentItem[]>(`content:${path}`, async () => {
						try {
							const modules = import.meta.glob("/content/**/*.md", { eager: true });
							const items: ContentItem[] = [];

							for (const filePath in modules) {
								const mod = modules[filePath] as any;
								const item: ContentItem = {
									...mod.default,
									_path: filePath
										.replace(/^\/content/, "")
										.replace(/\.md$/, ""),
									_dir: filePath
										.split("/")
										.slice(-2, -1)[0],
									_partial: false,
								};

								items.push(item);
							}

							return items;
						} catch (error) {
							console.error(`Error loading content for ${path}:`, error);
							return [];
						}
					});

					if (!data.value) return [];

					return data.value.filter((item: ContentItem) => {
						if (!isPathMatch(item._path, path)) return false;
						for (const key in query) {
							if (key === "_partial") {
								if (query[key] && !item._partial) return false;
								if (!query[key] && item._partial) return false;
							} else if (key === "_dir") {
								if (typeof query[key] === "object" && query[key].$ne) {
									if (item._dir === query[key].$ne) return false;
								} else {
									if (item._dir !== query[key]) return false;
								}
							} else if (item[key] !== query[key]) {
								return false;
							}
						}
						return true;
					});
				},
				findOne: async () => {
					const { data } = await useAsyncData(`content:${path}:one`, async () => {
						try {
							const modules = import.meta.glob("/content/**/*.md", { eager: true });

							for (const filePath in modules) {
								const mod = modules[filePath] as any;
								const item: ContentItem = {
									...mod.default,
									_path: filePath
										.replace(/^\/content/, "")
										.replace(/\.md$/, ""),
									_dir: filePath
										.split("/")
										.slice(-2, -1)[0],
									_partial: false,
								};

								if (isOnePathMatch(item._path, path)) {
									return item;
								}
							}

							return null;
						} catch (error) {
							console.error(`Error loading content for ${path}:`, error);
							return null;
						}
					});

					return data.value || null;
				},
			};
		},
		find: async () => {
			const { data } = await useAsyncData<ContentItem[]>(`content:${path}`, async () => {
				try {
					const modules = import.meta.glob("/content/**/*.md", { eager: true });
					const items: ContentItem[] = [];

					for (const filePath in modules) {
						const mod = modules[filePath] as any;
						const item: ContentItem = {
							...mod.default,
							_path: filePath
								.replace(/^\/content/, "")
								.replace(/\.md$/, ""),
							_dir: filePath
								.split("/")
								.slice(-2, -1)[0],
							_partial: false,
						};

						items.push(item);
					}

					return items;
				} catch (error) {
					console.error(`Error loading content for ${path}:`, error);
					return [];
				}
			});

			return (data.value || []).filter((item: ContentItem) => isPathMatch(item._path, path));
		},
		findOne: async () => {
			const { data } = await useAsyncData(`content:${path}:one`, async () => {
				try {
					const modules = import.meta.glob("/content/**/*.md", { eager: true });

					for (const filePath in modules) {
						const mod = modules[filePath] as any;
						const item: ContentItem = {
							...mod.default,
							_path: filePath
								.replace(/^\/content/, "")
								.replace(/\.md$/, ""),
							_dir: filePath
								.split("/")
								.slice(-2, -1)[0],
							_partial: false,
						};

						if (isOnePathMatch(item._path, path)) {
							return item;
						}
					}

					return null;
				} catch (error) {
					console.error(`Error loading content for ${path}:`, error);
					return null;
				}
			});

			return data.value || null;
		},
	};
}
