import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

export function MdxLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
	const href = props.href || "";

	if (href.startsWith("/")) {
		return (
			<Link href={href} {...props}>
				{props.children}
			</Link>
		);
	}

	if (href.startsWith("#")) {
		return <a {...props} />;
	}

	return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
