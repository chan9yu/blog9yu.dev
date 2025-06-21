import Link from "next/link";

import type { TableOfContentsItem } from "@/features/blog/types/toc";

type TableOfContentsLinkProps = {
	item: TableOfContentsItem;
};

export default function TableOfContentsLink({ item }: TableOfContentsLinkProps) {
	return (
		<div className="space-y-2">
			<Link
				key={item.id}
				href={`#${item.id}`}
				className="hover:text-foreground text-muted-foreground block font-medium transition-colors"
			>
				{item.title}
			</Link>
			{item.items && item.items.length > 0 && (
				<div className="space-y-2 pl-4">
					{item.items.map((subItem) => (
						<TableOfContentsLink key={subItem.id} item={subItem} />
					))}
				</div>
			)}
		</div>
	);
}
