export interface ContentItem {
	_path: string;
	_dir: string;
	_partial: boolean;
	title?: string;
	description?: string;
	order?: number;
	icon?: string;
	tags?: string[];
	body?: any;
	updatedAt?: string;
	category?: string;
	[key: string]: any;
}

export interface QueryBuilder {
	where: (query: any) => QueryBuilder;
	find: () => Promise<ContentItem[]>;
	findOne: () => Promise<ContentItem | null>;
}
