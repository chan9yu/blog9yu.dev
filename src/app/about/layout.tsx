import { Briefcase, Code2, Coffee, Github, Newspaper, User } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";

const menuItems = [
	{ icon: User, label: "프로필", href: "/about" },
	{ icon: Code2, label: "기술 스택", href: "/about/skills" },
	{ icon: Briefcase, label: "프로젝트", href: "/about/projects" },
	{ icon: Newspaper, label: "블로그", href: "/about/blog" },
	{ icon: Coffee, label: "컨택", href: "/about/contact" },
	{ icon: Github, label: "Github", href: "https://github.com", external: true }
];

export default function AboutLayout({ children }: PropsWithChildren) {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex gap-8">
				<aside className="w-64 shrink-0">
					<nav className="bg-card sticky top-8 space-y-1 rounded-lg border p-4">
						{menuItems.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
								{...(item.external && {
									target: "_blank",
									rel: "noopener noreferrer"
								})}
							>
								<item.icon className="h-4 w-4" />
								<span>{item.label}</span>
							</Link>
						))}
					</nav>
				</aside>

				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}
