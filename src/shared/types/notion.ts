export interface NotionTag {
	count: number;
	id: string;
	name: string;
}

export interface NotionPost {
	id: string;
	title: string;
	author?: string;
	coverImage?: string;
	date?: string;
	description?: string;
	tags?: NotionTag[];
}
