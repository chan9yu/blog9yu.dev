export interface TableOfContentsItem {
	id: string;
	title: string;
	items?: TableOfContentsItem[];
}
