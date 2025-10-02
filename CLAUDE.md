# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

blog9yu.dev - Next.js 15 기반의 개인 개발 블로그. MDX를 활용한 파일 시스템 기반 블로그 플랫폼으로, 프론트엔드 개발의 아이디어와 경험을 기록합니다.

## 기술 스택

- **Framework**: Next.js 15.5.4 (App Router)
- **Runtime**: React 19.1.1
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 4.1.13
- **Content**: MDX (next-mdx-remote 5.0.0)
- **Code Highlighting**: sugar-high 0.9.3
- **Fonts**: Geist (Sans & Mono)
- **Analytics**: Vercel Analytics & Speed Insights
- **Package Manager**: pnpm 10.17.1
- **Code Quality**: ESLint 9 + Prettier 3 + Lefthook

## 프로젝트 구조

```
blog9yu.dev/
├── src/
│   ├── app/                    # Next.js App Router (페이지와 라우트만)
│   │   ├── blog/
│   │   │   ├── [slug]/        # 블로그 상세 페이지 (동적 라우트)
│   │   │   └── page.tsx       # 블로그 목록 페이지
│   │   ├── og/                # OG 이미지 생성 (Dynamic Route)
│   │   ├── rss/               # RSS 피드 생성 (Route Handler)
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈페이지
│   │   ├── not-found.tsx      # 404 페이지
│   │   ├── sitemap.ts         # 사이트맵 생성
│   │   └── robots.ts          # robots.txt 생성
│   ├── components/            # 재사용 가능한 React 컴포넌트
│   │   ├── mdx.tsx           # MDX 커스텀 컴포넌트
│   │   ├── posts.tsx         # 블로그 목록 컴포넌트
│   │   ├── nav.tsx           # 네비게이션
│   │   └── footer.tsx        # 푸터
│   ├── lib/                   # 유틸리티 함수 및 비즈니스 로직
│   │   └── blog.ts           # MDX 파싱 및 블로그 관련 함수
│   ├── styles/                # 글로벌 스타일
│   │   └── globals.css       # Tailwind 기본 설정
│   └── content/               # 컨텐츠 (MDX 포스트)
│       └── posts/            # MDX 블로그 포스트
├── public/                    # 정적 파일
├── scripts/                   # Git hooks 및 스크립트
├── .prettierrc.yaml          # Prettier 설정
├── eslint.config.mjs         # ESLint Flat Config
├── lefthook.yaml             # Git hooks 설정
└── tsconfig.json             # TypeScript 설정
```

### 폴더 구조 설계 원칙 (2025-10 Best Practice)

1. **`src/app/`** - 페이지와 라우트만 위치 (Next.js App Router)
2. **`src/components/`** - 재사용 가능한 UI 컴포넌트
3. **`src/lib/`** - 유틸리티 함수, 비즈니스 로직
4. **`src/styles/`** - 글로벌 CSS 파일
5. **`src/content/`** - MDX 포스트 등 컨텐츠 파일

## 개발 명령어

```bash
# 개발 서버 (포트 3035)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버
pnpm start

# 타입 체크
pnpm type-check

# 린트
pnpm lint
pnpm lint:fix

# 포맷팅
pnpm format
pnpm format:check
```

## 블로그 시스템 아키텍처

### MDX 기반 컨텐츠 관리

- **저장 위치**: GitHub Repository (`https://github.com/chan9yu/blog9yu-content/`)
- **빌드 타임 처리**: Static Site Generation (SSG) + ISR (Incremental Static Regeneration)
- **재검증 주기**: 3600초 (1시간)
- **Frontmatter 스키마**:
  ```yaml
  ---
  title: string # 필수
  publishedAt: string # 필수 (YYYY-MM-DD)
  summary: string # 필수
  image?: string # 선택 (OG 이미지)
  ---
  ```

### 핵심 유틸리티

**src/lib/github.ts** - GitHub API 클라이언트

```typescript
// GitHub Repository에서 MDX 파일 목록 가져오기
getGitHubMDXFiles(): Promise<GitHubFile[]>

// MDX 파일 내용 가져오기 (Raw URL 방식)
getGitHubFileContentRaw(fileName: string): Promise<string>
```

**src/lib/blog.ts** - 블로그 데이터 처리

```typescript
// GitHub에서 블로그 포스트 가져오기 (ISR 적용)
getBlogPosts(): Promise<Array<{ metadata: Metadata; slug: string; content: string }>>

// 날짜 포맷팅 (상대/절대)
formatDate(date: string, includeRelative?: boolean): string
```

### MDX 커스텀 컴포넌트 (src/components/mdx.tsx)

- **Heading (h1-h6)**: 자동 ID 생성 및 앵커 링크
- **Image**: rounded-lg 스타일 적용
- **Link**: 내부/외부 링크 자동 구분
- **Code**: sugar-high 코드 하이라이팅
- **Table**: 커스텀 테이블 렌더링

### SEO & 메타데이터

- 동적 메타데이터 생성 (Open Graph, Twitter Card)
- 자동 OG 이미지 생성 (`/og?title=...`)
- JSON-LD 구조화 데이터 (BlogPosting)
- 자동 Sitemap 생성
- RSS 피드 제공 (`/rss`)

## TypeScript 경로 매핑

```json
{
	"paths": {
		"@/*": ["./src/*"],
		"app/*": ["./src/app/*"]
	}
}
```

## Next.js 15 주요 변경사항 대응

### Async Params & SearchParams

```typescript
// ✅ Next.js 15 방식
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	// ...
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	// ...
}
```

## Prettier 설정 (.prettierrc.yaml)

```yaml
printWidth: 120
tabWidth: 2
useTabs: true
singleQuote: false
semi: true
bracketSpacing: true
arrowParens: always
trailingComma: none
jsxSingleQuote: false
bracketSameLine: false
plugins:
	- prettier-plugin-tailwindcss
```

## ESLint 설정 (eslint.config.mjs)

```javascript
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = [
	// Next.js 권장 설정
	...compat.extends("next/core-web-vitals", "next/typescript"),

	// Prettier 통합
	...compat.extends("prettier"),

	{
		plugins: {
			"simple-import-sort": simpleImportSort,
			prettier: prettier
		},
		rules: {
			"prettier/prettier": "error",
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_"
				}
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"no-console": ["warn", { allow: ["warn", "error"] }]
		}
	}
];
```

## 📝 TypeScript 클래스 작성 규칙

### 네이밍 컨벤션

- **클래스명**: PascalCase + 역할별 접미사 사용
- **메서드/프로퍼티**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **인터페이스**: PascalCase (Interface 접두사 사용 금지)

### 클래스 접미사 가이드

| 접미사      | 사용 목적          | 예시                                 |
| ----------- | ------------------ | ------------------------------------ |
| Service     | 비즈니스 로직 처리 | `UserService`, `PaymentService`      |
| Manager     | 복합 관리 로직     | `OrderManager`, `CacheManager`       |
| Client      | 외부 API 통신      | `PaymentClient`, `ApiClient`         |
| Provider    | 의존성 제공        | `DatabaseProvider`, `ConfigProvider` |
| Factory     | 객체 생성          | `PostFactory`, `UserFactory`         |
| Validator   | 검증 로직          | `FormValidator`, `DataValidator`     |
| Helper/Util | 유틸리티           | `DateHelper`, `StringUtil`           |

### 클래스 멤버 순서

> 리턴타입은 타입추론이 되는한 명시하지않는다

```typescript
class BlogPostService {
	// 1. Static 프로퍼티 (public → protected → private)
	public static readonly VERSION = "1.0.0";
	private static instance: BlogPostService;

	// 2. Instance 프로퍼티 (public → protected → private)
	public readonly id: string;
	protected name: string;
	private _count: number = 0;

	// 3. Constructor
	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
	}

	// 4. Getter/Setter
	public get count() {
		return this._count;
	}

	// 5. Static 메서드
	public static getInstance() {
		if (!this.instance) {
			this.instance = new BlogPostService("default", "Default");
		}
		return this.instance;
	}

	// 6. Instance 메서드 (public → protected → private)
	public getName() {
		return this.name;
	}

	protected updateCount() {
		this._count++;
	}

	private validateInput(input: string) {
		return input.trim().length > 0;
	}
}
```

## ⚛️ React 컴포넌트 작성 규칙

### 컴포넌트 내부 코드 순서

```tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { fetchPost } from "@/api/posts";
import { Button } from "@/components/ui/Button";
import type { Post } from "@/types/post";

// 타입 정의
type BlogPostProps = {
	slug: string;
	onLike: () => void;
	className?: string;
};

type LoadingState = "idle" | "loading" | "success" | "error";

// 상수 정의
const FETCH_TIMEOUT_MS = 5000;

export function BlogPost({ slug, onLike, className = "" }: BlogPostProps) {
	// 1. 상태 관리 (useState)
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState<LoadingState>("idle");

	// 2. Ref 정의
	const contentRef = useRef<HTMLDivElement>(null);

	// 3. Context 사용
	const theme = useTheme();

	// 4. 외부 Store 구독
	const { data: relatedPosts } = useQuery(["related", slug], () => fetchRelated(slug));

	// 5. 파생 값 계산 (useMemo)
	const formattedDate = useMemo(() => formatDate(post?.publishedAt), [post]);

	// 6. 콜백 함수 (useCallback)
	const handleLike = useCallback(() => {
		onLike();
	}, [onLike]);

	// 7. Side Effects (useEffect)
	useEffect(() => {
		fetchPost(slug).then(setPost);
	}, [slug]);

	// 8. 이벤트 핸들러
	const handleShare = (e: React.MouseEvent) => {
		e.preventDefault();
		// 핸들러 로직
	};

	// 9. 헬퍼 함수
	const formatContent = (content: string) => {
		return content.trim();
	};

	// 10. 조건부 렌더링 (Early Return)
	if (loading === "loading") {
		return <div>Loading...</div>;
	}

	// 11. 메인 JSX 반환
	return <article className={className}>{/* 내용 */}</article>;
}
```

## 🎨 코드 스타일 가이드 (게슈탈트 원칙 적용)

### 네이밍 컨벤션

- **컴포넌트/타입**: PascalCase
- **함수/변수**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **파일명**: kebab-case (컴포넌트는 PascalCase.tsx도 허용)

### 1. 근접성 원칙 - 빈줄로 그룹 구분

```typescript
// ✅ 좋은 예: 관련 코드끼리 그룹핑
const handlePostSubmit = async (data: PostFormData) => {
	// 검증 로직 그룹
	const titleValidation = validateTitle(data.title);
	const contentValidation = validateContent(data.content);

	if (!titleValidation.ok || !contentValidation.ok) {
		setErrors([titleValidation, contentValidation]);
		return;
	}

	// API 호출 그룹
	setLoading(true);
	try {
		const response = await createPost(data);
		setSuccess(true);
		router.push(`/blog/${response.slug}`);
	} catch (error) {
		setError(error.message);
	} finally {
		setLoading(false);
	}
};
```

### 2. 공통영역 원칙 - 연관된 것끼리 함수로 그룹핑

```typescript
// ✅ 좋은 예: 블로그 포스트 관련 로직을 하나의 함수로
const useBlogPostFlow = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);

	const loadPosts = async () => {
		const allPosts = getBlogPosts();
		setPosts(allPosts);
	};

	const selectPost = (slug: string) => {
		const post = posts.find((p) => p.slug === slug);
		setSelectedPost(post || null);
	};

	return { posts, selectedPost, loadPosts, selectPost };
};
```

### 3. 유사성 원칙 - 일관된 네이밍

```typescript
// ✅ 좋은 예: 일관된 패턴
const handlePostCreate = () => {};
const handlePostUpdate = () => {};
const handlePostDelete = () => {};

const validateTitle = () => {};
const validateContent = () => {};
const validateDate = () => {};
```

### 4. 연속성 원칙 - 의존성 순서대로 배치

```typescript
// ✅ 좋은 예: 의존성 흐름을 따라 순서대로
const loadBlogPostWithRelated = async (slug: string) => {
	const post = await fetchPost(slug);
	const relatedPosts = await fetchRelatedPosts(post.metadata.tags);
	const author = await fetchAuthor(post.metadata.authorId);

	return { post, relatedPosts, author };
};
```

### 매직 넘버/값 네이밍

```typescript
// ✅ 좋은 예
const MAX_POSTS_PER_PAGE = 10;
const ANIMATION_DURATION_MS = 300;
const DEFAULT_LOCALE = "ko-KR";
const CACHE_TTL_SECONDS = 3600;
```

### 복잡한 조건문 분리

```typescript
// ✅ 좋은 예
const isPublished = post.status === "published";
const isRecent = Date.now() - new Date(post.publishedAt).getTime() < 7 * 24 * 60 * 60 * 1000;
const hasComments = post.comments?.length > 0;

if (isPublished && isRecent && hasComments) {
	// 최근 게시된 댓글 있는 포스트 처리
}
```

## 🏗️ 코드 품질 원칙

### 가독성 (Readability)

#### 매직 넘버 네이밍

```typescript
// ✅ 좋은 예
const ANIMATION_DELAY_MS = 300;
const MAX_RETRY_COUNT = 3;

async function onPostLikeClick() {
	await postLike(url);
	await delay(ANIMATION_DELAY_MS);
	await refetchPostLikes();
}
```

#### 복잡한 조건문 네이밍

```typescript
// ✅ 좋은 예
const filteredPosts = posts.filter((post) => {
	const isSameCategory = post.categories.some((category) => category.id === targetCategory.id);
	const isPublished = post.status === "published";
	const isRecent = Date.now() - new Date(post.publishedAt).getTime() < 30 * 24 * 60 * 60 * 1000;

	return isSameCategory && isPublished && isRecent;
});
```

### 예측가능성 (Predictability)

#### 표준화된 반환 타입

```typescript
// ✅ 좋은 예: 일관된 ValidationResult 타입
type ValidationResult = { ok: true } | { ok: false; reason: string };

function validateTitle(title: string): ValidationResult {
	if (title.length === 0) return { ok: false, reason: "Title cannot be empty." };
	if (title.length > 100) return { ok: false, reason: "Title too long." };
	return { ok: true };
}

function validateContent(content: string): ValidationResult {
	if (content.length < 50) return { ok: false, reason: "Content too short." };
	return { ok: true };
}
```

#### 단일 책임 원칙

```typescript
// ✅ 좋은 예: 각 함수가 하나의 역할만 수행
async function fetchPost(slug: string) {
	return await api.get(`/posts/${slug}`);
}

async function incrementViewCount(slug: string) {
	await api.post(`/posts/${slug}/view`);
}

// 사용처에서 명시적으로 조합
async function loadPost(slug: string) {
	const post = await fetchPost(slug);
	await incrementViewCount(slug);
	return post;
}
```

### 결합도 (Coupling)

#### 컴포넌트 컴포지션으로 Props Drilling 해결

```tsx
// ✅ 좋은 예: 컴포지션 패턴
function PostFilterModal({ open, posts, onConfirm, onClose }: PostFilterModalProps) {
	const [keyword, setKeyword] = useState("");

	return (
		<Modal open={open} onClose={onClose}>
			<div className="mb-4 flex justify-between">
				<input
					value={keyword}
					onChange={(e) => setKeyword(e.target.value)}
					placeholder="Search posts..."
					className="rounded border px-3 py-2"
				/>
				<button onClick={onClose} className="rounded bg-gray-200 px-4 py-2">
					Close
				</button>
			</div>
			<PostFilterList keyword={keyword} posts={posts} onConfirm={onConfirm} />
		</Modal>
	);
}
```

## 📋 코드 리뷰 체크리스트

### 구조 및 네이밍

- [ ] 클래스/함수명이 역할을 명확히 표현하는가?
- [ ] 접미사가 적절히 사용되었는가? (Service, Manager, Factory 등)
- [ ] 매직 넘버가 적절히 네이밍되었는가?
- [ ] 복잡한 조건문이 네이밍된 변수로 분리되었는가?

### 코드 배치

- [ ] 관련 코드끼리 근접하게 배치되었는가?
- [ ] 빈줄로 논리적 그룹이 구분되었는가?
- [ ] 의존성 흐름에 따라 순서가 배치되었는가?
- [ ] React 컴포넌트 내부 순서가 가이드를 따르는가?

### 품질

- [ ] 함수/메서드가 단일 책임을 가지는가?
- [ ] 반환 타입이 일관성 있게 표준화되었는가?
- [ ] Props drilling이 적절히 해결되었는가?
- [ ] Early return이 적절히 사용되었는가?

### 추상화

- [ ] 적절한 수준의 추상화가 이루어졌는가?
- [ ] 구현 세부사항이 적절히 숨겨졌는가?
- [ ] 재사용 가능한 형태로 설계되었는가?
- [ ] 이름만으로도 기능을 유추할 수 있는가?

## 🚨 안티패턴 (피해야 할 것들)

### ❌ 나쁜 예시들

#### 1. 순서가 뒤섞인 컴포넌트

```typescript
// ❌ 나쁜 예
export function BadComponent() {
	const handleClick = () => {}; // 핸들러가 너무 위에
	const [state, setState] = useState(); // 상태가 아래에
	const data = useMemo(() => {}, []); // 파생 값이 중간에
	useEffect(() => {}, []); // 부수 효과가 중간에
}
```

#### 2. 복잡한 조건문이 인라인으로

```typescript
// ❌ 나쁜 예
return (
	<div>
		{post && post.status === "published" && post.author?.role === "admin" && post.categories.length > 0 ? (
			<AdminPostView />
		) : post && post.status === "published" ? (
			<PublicPostView />
		) : (
			<DraftNotice />
		)}
	</div>
);
```

#### 3. 일관성 없는 네이밍

```typescript
// ❌ 나쁜 예
const getPostInfo = () => {}; // get 사용
const fetchPostData = () => {}; // fetch 사용
const retrievePostDetails = () => {}; // retrieve 사용
```

#### 4. 매직 넘버 그대로 사용

```typescript
// ❌ 나쁜 예
if (posts.length > 10) {
	// 왜 10인지 알 수 없음
	showMoreButton();
}

setTimeout(() => {
	refresh();
}, 5000); // 5000이 무엇인지 불명확
```

## 💡 리팩토링 가이드라인

### 리팩토링 원칙

1. **기능 유지**: 기존 동작을 반드시 그대로 유지할 것
2. **점진적 진행**: 작은 단위로 단계적으로 개선할 것
3. **테스트 우선**: 리팩토링 전후 테스트로 안정성 보장할 것
4. **의존성 순서**: 가장 의존성이 적은 부분부터 시작할 것

### 리팩토링 우선순위

1. **코드 작게 만들기** - 함수/컴포넌트 분리
2. **적은 코드 수** - 불필요한 코드 제거
3. **삭제 가능한 형태** - 의존성 최소화

### 실전 적용 예시

```typescript
// Before: 복잡한 함수
async function loadPostPage(slug: string) {
	const post = await fetchPost(slug);
	await incrementViewCount(slug);
	const related = await fetchRelatedPosts(post.tags);
	const author = await fetchAuthor(post.authorId);
	logEvent("post_viewed", { slug });
	return { post, related, author };
}

// After: 단일 책임으로 분리
async function fetchPost(slug: string) {
	return await api.get(`/posts/${slug}`);
}

async function incrementViewCount(slug: string) {
	await api.post(`/posts/${slug}/view`);
}

async function fetchRelatedPosts(tags: string[]) {
	return await api.get(`/posts/related`, { params: { tags } });
}

async function fetchAuthor(authorId: string) {
	return await api.get(`/authors/${authorId}`);
}

async function logPostView(slug: string) {
	logEvent("post_viewed", { slug });
}

// 사용처에서 명시적으로 조합
async function loadPostPage(slug: string) {
	const post = await fetchPost(slug);
	await Promise.all([incrementViewCount(slug), logPostView(slug)]);
	const [related, author] = await Promise.all([fetchRelatedPosts(post.tags), fetchAuthor(post.authorId)]);
	return { post, related, author };
}
```

## 🎓 학습 및 적용 방법

### 단계별 학습 권장사항

1. **Prettier/ESLint 설정** - 자동 포맷팅 환경 구축
2. **남의 코드 읽기** - 좋은 코드와 나쁜 코드 분석
3. **느낌 논리화하기** - 왜 좋은지/나쁜지 설명할 수 있게 연습
4. **내 코드 설명하기** - 다른 사람에게 설명하며 점검
5. **의식적 적용** - 항상 누군가 읽을 것이라 생각하고 작성

### AI 도구 활용 시 주의사항

- **코드 리뷰 필수**: AI 생성 코드도 반드시 검토
- **가이드라인 준수**: AI에게 이 가이드라인 내용을 명시적으로 전달
- **점진적 개선**: 한 번에 완벽한 코드보다는 지속적인 개선

## 중요 규칙

### TypeScript

- 리턴 타입은 타입 추론이 가능하면 명시하지 않음
- `any` 사용 최소화 (경고 레벨)
- 미사용 변수는 `_` prefix 사용

### React

- Server Component를 기본으로 사용
- Client Component는 명시적으로 `'use client'` 선언
- async/await는 Server Component에서만 사용

### 스타일링

- Tailwind CSS 유틸리티 우선
- className은 prettier-plugin-tailwindcss로 자동 정렬
- 커스텀 CSS는 최소화

## 배포 및 성능

### Static Generation

- 모든 블로그 페이지는 빌드 타임에 생성 (SSG)
- `generateStaticParams()`로 동적 라우트 미리 생성
- ISR 미사용 (컨텐츠 업데이트 시 재배포)

### 최적화

- Geist 폰트 최적화 (next/font)
- 이미지 최적화 (next/image)
- 코드 스플리팅 자동 적용
- Vercel Analytics로 성능 모니터링

## 주의사항

- 블로그 포스트는 GitHub Repository (`chan9yu/blog9yu-content`)의 `posts/` 디렉토리에 위치
- MDX frontmatter는 반드시 검증 후 사용
- GitHub API Rate Limit: 인증 없이 시간당 60회 (충분함)
- ISR을 통해 1시간마다 새로운 포스트 자동 반영
- baseUrl은 프로덕션 배포 시 변경 필요 (`src/app/sitemap.ts`)

## GitHub 컨텐츠 레포지토리

- **Repository**: https://github.com/chan9yu/blog9yu-content
- **구조**: `posts/*.mdx`
- **접근 방식**: GitHub Raw URL을 통한 직접 fetch
- **캐싱**: Next.js ISR (revalidate: 3600초)

## Import 경로 규칙

- `@/components/*` - 컴포넌트
- `@/lib/*` - 유틸리티 함수
- `@/styles/*` - 스타일 파일
- 같은 app 디렉토리 내에서는 상대 경로 사용 가능

## AI 도구 활용 가이드

- 이 CLAUDE.md 내용을 참고하여 코드 생성
- 프로젝트 구조와 네이밍 컨벤션 준수
- TypeScript 타입 안정성 우선
- Next.js 15 최신 패턴 적용
