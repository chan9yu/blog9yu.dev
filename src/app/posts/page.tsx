import type { Metadata } from "next";
import { Suspense } from "react";

import { FilteredBlogPosts, getAllPosts } from "@/features/blog";
import { getTagCounts, TagList } from "@/features/tags";
import { SITE } from "@/shared/config";

export const metadata: Metadata = {
	title: "포스트",
	description: "프론트엔드 개발 경험과 학습 내용을 기록합니다. React, TypeScript, Next.js 등 다양한 주제를 다룹니다.",
	openGraph: {
		title: "포스트 · chan9yu",
		description: "프론트엔드 개발 경험과 학습 내용을 기록합니다",
		type: "website",
		url: `${SITE.url}/posts`,
		images: [
			{
				url: SITE.defaultOG,
				width: 1200,
				height: 630,
				alt: "포스트 · chan9yu"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "포스트 · chan9yu",
		description: "프론트엔드 개발 경험과 학습 내용을 기록합니다",
		images: [SITE.defaultOG]
	},
	alternates: {
		canonical: `${SITE.url}/posts`
	}
};

export default async function Page({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
	const [posts, tagCounts] = await Promise.all([getAllPosts(), getTagCounts()]);
	const { tag } = await searchParams;

	return (
		<div className="space-y-8">
			<header className="space-y-3">
				<h1 className="text-primary text-2xl font-bold tracking-tight sm:text-3xl">포스트</h1>
				<p className="text-secondary text-sm leading-relaxed sm:text-base">개발하면서 배운 것들을 기록합니다</p>
			</header>

			<div className="flex gap-8">
				<aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit lg:w-[220px]">
					<TagList tagCounts={tagCounts} currentTag={tag} variant="filter" />
				</aside>

				<main className="min-w-0 flex-1">
					<Suspense
						fallback={
							<div className="flex items-center justify-center py-12">
								<div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
							</div>
						}
					>
						<FilteredBlogPosts posts={posts} selectedTag={tag} />
					</Suspense>
				</main>
			</div>
		</div>
	);
}
