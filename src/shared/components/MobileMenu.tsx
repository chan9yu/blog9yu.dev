"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import MenuIcon from "@/shared/assets/icons/menu.svg";
import XIcon from "@/shared/assets/icons/x.svg";

import { cn } from "../utils";
import { Drawer } from "./Drawer";

const navItems = {
	"/": { name: "홈" },
	"/posts": { name: "포스트" },
	"/series": { name: "시리즈" },
	"/tags": { name: "태그" },
	"/about": { name: "About" }
} as const;

export function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	// 경로 변경 시 메뉴 닫기
	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	return (
		<>
			{/* Hamburger Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="text-primary hover:bg-secondary flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors md:hidden"
				aria-label="메뉴 열기"
			>
				<MenuIcon className="size-6" />
			</button>

			{/* Mobile Menu Drawer */}
			<Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} className="md:hidden">
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="border-primary flex items-center justify-between border-b px-6 py-6">
						<span className="text-primary text-lg font-bold">메뉴</span>
						<button
							onClick={() => setIsOpen(false)}
							className="text-secondary hover:text-primary hover:bg-secondary flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors"
							aria-label="메뉴 닫기"
						>
							<XIcon className="size-5" />
						</button>
					</div>

					{/* Navigation Links */}
					<nav className="flex-1 overflow-y-auto px-4 py-6">
						<ul className="space-y-2">
							{Object.entries(navItems).map(([path, { name }]) => {
								const isActive = pathname === path;
								return (
									<li key={path}>
										<Link
											href={path}
											className={cn(
												"text-secondary hover:bg-secondary hover:text-primary block min-h-[44px] rounded-lg px-4 py-3 text-base font-medium transition-colors",
												isActive && "bg-secondary text-primary"
											)}
										>
											{name}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>
				</div>
			</Drawer>
		</>
	);
}
