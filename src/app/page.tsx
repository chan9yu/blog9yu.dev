import Link from "next/link";

import PostCard from "@/features/main/components/PostCard";
import ProfileSection from "@/features/main/components/ProfileSection";
import TagSection from "@/features/main/components/TagSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import type { NotionPost, NotionTag } from "@/shared/types/notion";

const mockTags: NotionTag[] = [
	{ name: "전체", id: "1", count: 6 },
	{ name: "HTML", id: "2", count: 1 },
	{ name: "CSS", id: "3", count: 1 },
	{ name: "JavaScript", id: "4", count: 1 },
	{ name: "TypeScript", id: "5", count: 1 },
	{ name: "React", id: "6", count: 1 },
	{ name: "Next.js", id: "7", count: 1 }
];

const mockPosts: NotionPost[] = [
	{
		id: "1",
		title: "Next.js 13으로 블로그 만들기",
		description: "Next.js 13과 Notion API를 활용하여 개인 블로그를 만드는 방법을 알아봅니다.",
		coverImage: "https://picsum.photos/800/400",
		tags: [mockTags[5], mockTags[6]],
		author: "chan9yu",
		date: "2024-02-01"
	},
	{
		id: "2",
		title: "TypeScript 기초 다지기",
		description: "TypeScript의 기본 문법과 실전에서 자주 사용되는 패턴들을 살펴봅니다.",
		coverImage: "https://picsum.photos/800/401",
		tags: [mockTags[3], mockTags[4]],
		author: "chan9yu",
		date: "2024-01-15"
	}
];

export default function MainPage() {
	return (
		<div className="container py-8">
			<div className="grid grid-cols-[200px_1fr_220px] gap-6">
				{/* 좌측 사이드바 */}
				<aside>
					<TagSection tags={mockTags} />
				</aside>

				<div className="space-y-8">
					{/* 섹션 제목 */}
					<div className="flex items-center justify-between">
						<h2 className="text-3xl font-bold tracking-tight">블로그 목록</h2>
						<Select defaultValue="latest">
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="정렬 방식 선택" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="latest">최신순</SelectItem>
								<SelectItem value="oldest">오래된순</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* 블로그 카드 그리드 */}
					<div className="grid gap-4">
						{/* 블로그 카드 반복 */}
						{mockPosts.map((post) => (
							<Link href={`/blog/${post.id}`} key={post.id}>
								<PostCard post={post} />
							</Link>
						))}
					</div>
				</div>

				{/* 우측 사이드바 */}
				<aside className="flex flex-col gap-6">
					<ProfileSection />
				</aside>
			</div>
		</div>
	);
}
