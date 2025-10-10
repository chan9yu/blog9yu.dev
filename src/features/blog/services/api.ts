import type { PostDetail, PostSummary } from "@/features/blog/types";
import { parseFrontmatter } from "@/features/blog/utils";
import { getGitHubFileContentRaw, getGitHubMDXFiles } from "@/shared/services";

/**
 * GitHub Repository에서 모든 블로그 포스트를 가져옵니다
 * @param includePrivate - private 포스트 포함 여부 (기본값: false)
 */
export async function getAllPosts(includePrivate = false): Promise<PostSummary[]> {
	try {
		// 1. GitHub에서 포스트 디렉토리 목록 가져오기
		const directories = await getGitHubMDXFiles();

		// 2. 각 디렉토리의 index.mdx 내용 가져오기 및 파싱
		const posts = await Promise.all(
			directories.map(async (dir) => {
				const slug = dir.name;
				const rawContent = await getGitHubFileContentRaw(slug);
				const { metadata } = parseFrontmatter(rawContent);

				// slug 검증 (디렉토리명과 일치해야 함)
				if (metadata.slug !== slug) {
					console.warn(`⚠️  [${dir.name}] slug 불일치: frontmatter(${metadata.slug}) !== dirname(${slug})`);
				}

				return {
					...metadata,
					slug // 디렉토리명 우선 사용
				};
			})
		);

		// 3. private 포스트 필터링
		return includePrivate ? posts : posts.filter((post) => !post.private);
	} catch (error) {
		console.error("Failed to fetch blog posts from GitHub:", error);
		return [];
	}
}

/**
 * 특정 포스트의 상세 정보를 가져옵니다
 * @param slug - 포스트 slug
 * @param includePrivate - private 포스트 접근 허용 여부 (기본값: false)
 */
export async function getPostDetail(slug: string, includePrivate = false): Promise<PostDetail | null> {
	try {
		const rawContent = await getGitHubFileContentRaw(slug);
		const { metadata, content } = parseFrontmatter(rawContent);

		// private 포스트 접근 제한
		if (metadata.private && !includePrivate) {
			console.warn(`⚠️  Private post access denied: ${slug}`);
			return null;
		}

		return {
			...metadata,
			slug,
			content
		};
	} catch (error) {
		console.error(`Failed to fetch post detail for ${slug}:`, error);
		return null;
	}
}
