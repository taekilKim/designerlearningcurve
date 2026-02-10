import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// ── 디자인 전문 소스만 (테크블로그 제외) ──
const RSS_SOURCES = [
  // ── 브런치 (디자인 키워드) ──
  { name: "브런치 UI디자인", url: "https://brunch.co.kr/rss/keyword/UI%EB%94%94%EC%9E%90%EC%9D%B8", category: "UI 디자인" },
  { name: "브런치 UX디자인", url: "https://brunch.co.kr/rss/keyword/UX%EB%94%94%EC%9E%90%EC%9D%B8", category: "UX 디자인" },
  { name: "브런치 디자인시스템", url: "https://brunch.co.kr/rss/keyword/%EB%94%94%EC%9E%90%EC%9D%B8%EC%8B%9C%EC%8A%A4%ED%85%9C", category: "디자인 시스템" },
  { name: "브런치 타이포그래피", url: "https://brunch.co.kr/rss/keyword/%ED%83%80%EC%9D%B4%ED%8F%AC%EA%B7%B8%EB%9E%98%ED%94%BC", category: "타이포그래피" },
  { name: "브런치 컬러", url: "https://brunch.co.kr/rss/keyword/%EC%BB%AC%EB%9F%AC%EB%94%94%EC%9E%90%EC%9D%B8", category: "컬러 이론" },
  { name: "브런치 레이아웃", url: "https://brunch.co.kr/rss/keyword/%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83", category: "레이아웃" },
  { name: "브런치 피그마", url: "https://brunch.co.kr/rss/keyword/%ED%94%BC%EA%B7%B8%EB%A7%88", category: "피그마 실무" },
  { name: "브런치 아이콘", url: "https://brunch.co.kr/rss/keyword/%EC%95%84%EC%9D%B4%EC%BD%98%EB%94%94%EC%9E%90%EC%9D%B8", category: "아이콘 디자인" },
  { name: "브런치 반응형", url: "https://brunch.co.kr/rss/keyword/%EB%B0%98%EC%9D%91%ED%98%95%EB%94%94%EC%9E%90%EC%9D%B8", category: "반응형 디자인" },
  { name: "브런치 사용자리서치", url: "https://brunch.co.kr/rss/keyword/%EC%82%AC%EC%9A%A9%EC%9E%90%EB%A6%AC%EC%84%9C%EC%B9%98", category: "사용자 리서치" },
  { name: "브런치 인터랙션", url: "https://brunch.co.kr/rss/keyword/%EC%9D%B8%ED%84%B0%EB%9E%99%EC%85%98%EB%94%94%EC%9E%90%EC%9D%B8", category: "인터랙션 디자인" },
  { name: "브런치 프로덕트디자인", url: "https://brunch.co.kr/rss/keyword/%ED%94%84%EB%A1%9C%EB%8D%95%ED%8A%B8%EB%94%94%EC%9E%90%EC%9D%B8", category: "프로덕트 디자인" },
  // 추가 브런치 키워드 (리서치/기획)
  { name: "브런치 UX리서치", url: "https://brunch.co.kr/rss/keyword/UX%EB%A6%AC%EC%84%9C%EC%B9%98", category: "사용자 리서치" },
  { name: "브런치 서비스기획", url: "https://brunch.co.kr/rss/keyword/%EC%84%9C%EB%B9%84%EC%8A%A4%EA%B8%B0%ED%9A%8D", category: "사용자 리서치" },
  { name: "브런치 사용성테스트", url: "https://brunch.co.kr/rss/keyword/%EC%82%AC%EC%9A%A9%EC%84%B1%ED%85%8C%EC%8A%A4%ED%8A%B8", category: "사용자 리서치" },
  { name: "브런치 정보설계", url: "https://brunch.co.kr/rss/keyword/%EC%A0%95%EB%B3%B4%EC%84%A4%EA%B3%84", category: "사용자 리서치" },
  // 추가 브런치 키워드 (디자인 시스템)
  { name: "브런치 컴포넌트디자인", url: "https://brunch.co.kr/rss/keyword/%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%94%94%EC%9E%90%EC%9D%B8", category: "디자인 시스템" },
  { name: "브런치 디자인가이드", url: "https://brunch.co.kr/rss/keyword/%EB%94%94%EC%9E%90%EC%9D%B8%EA%B0%80%EC%9D%B4%EB%93%9C", category: "디자인 시스템" },
  { name: "브런치 스타일가이드", url: "https://brunch.co.kr/rss/keyword/%EC%8A%A4%ED%83%80%EC%9D%BC%EA%B0%80%EC%9D%B4%EB%93%9C", category: "디자인 시스템" },

  // ── 국내 디자인 커뮤니티 & 매거진 ──
  { name: "서핏 매거진", url: "https://mag.surfit.io/feed", category: "프로덕트 디자인" },
  { name: "요즘IT", url: "https://yozm.wishket.com/magazine/feed/", category: "프로덕트 디자인" },
  { name: "DISQUIET", url: "https://disquiet.io/rss", category: "프로덕트 디자인" },

  // ── velog ──
  { name: "velog UXUI", url: "https://v2.velog.io/rss/tag/UXUI", category: "UX 디자인" },
  { name: "velog 디자인", url: "https://v2.velog.io/rss/tag/%EB%94%94%EC%9E%90%EC%9D%B8", category: "UI 디자인" },
  { name: "velog Figma", url: "https://v2.velog.io/rss/tag/figma", category: "피그마 실무" },

  // ── Medium (디자인 태그만) ──
  { name: "Medium UX", url: "https://medium.com/feed/tag/ux-design", category: "UX 디자인" },
  { name: "Medium UI", url: "https://medium.com/feed/tag/ui-design", category: "UI 디자인" },
  { name: "Medium Design Systems", url: "https://medium.com/feed/tag/design-systems", category: "디자인 시스템" },
  { name: "Medium UX Research", url: "https://medium.com/feed/tag/ux-research", category: "사용자 리서치" },
  { name: "Medium Product Design", url: "https://medium.com/feed/tag/product-design", category: "프로덕트 디자인" },
  { name: "Medium Interaction Design", url: "https://medium.com/feed/tag/interaction-design", category: "인터랙션 디자인" },
];

interface ArticleData {
  title: string;
  description: string;
  url: string;
  thumbnail_url: string | null;
  author: string | null;
  published_at: string;
  category: string;
}

function classifyCategory(title: string, desc: string, fallback: string): string {
  const text = `${title} ${desc}`.toLowerCase();
  const rules: [string[], string][] = [
    [["디자인 시스템", "design system", "컴포넌트 라이브러리", "토큰"], "디자인 시스템"],
    [["타이포", "서체", "폰트", "font", "typography", "글꼴", "행간", "자간"], "타이포그래피"],
    [["컬러", "color", "색상", "팔레트", "배색", "명도", "채도"], "컬러 이론"],
    [["아이콘", "icon", "svg", "벡터"], "아이콘 디자인"],
    [["그리드", "grid", "레이아웃", "layout", "여백", "spacing", "정렬"], "레이아웃"],
    [["반응형", "responsive", "브레이크포인트", "adaptive", "모바일 대응"], "반응형 디자인"],
    [["피그마", "figma", "오토레이아웃", "auto layout", "컴포넌트 정리"], "피그마 실무"],
    [["리서치", "research", "인터뷰", "사용성 테스트", "유저 테스트", "페르소나",
      "저니맵", "journey map", "hmw", "how might we", "문제 정의", "problem definition",
      "사용자 조사", "user research", "디자인 리서치", "설문", "survey",
      "데이터 리터러시", "정량 분석", "정성 분석", "a/b 테스트", "ab테스트",
      "인사이트 도출", "어피니티 다이어그램", "affinity diagram"], "사용자 리서치"],
    [["인터랙션", "interaction", "모션", "애니메이션", "마이크로인터랙션", "트랜지션"], "인터랙션 디자인"],
    [["프로덕트", "product", "서비스 디자인", "ux 전략", "서비스 기획",
      "고객 여정", "사용자 플로우", "user flow", "정보 설계", "ia 설계",
      "information architecture"], "프로덕트 디자인"],
    [["ui 원리", "ui 패턴", "ui 컴포넌트", "버튼", "입력 필드", "네비게이션", "카드 디자인",
      "와이어프레임", "wireframe", "프로토타입", "prototype", "목업"], "UI 디자인"],
    [["ux 원칙", "사용자 경험", "휴리스틱", "어포던스", "접근성",
      "ux 법칙", "ux law", "닐슨", "노먼", "멘탈 모델", "인지 부하",
      "ux 라이팅", "ux writing", "마이크로카피"], "UX 디자인"],
  ];
  for (const [keywords, category] of rules) {
    if (keywords.some((kw) => text.includes(kw))) return category;
  }
  return fallback;
}

// 디자인 관련 키워드가 있는지 엄격 체크
function hasDesignRelevance(text: string): boolean {
  const designKeywords = [
    "ux", "ui", "디자인", "design", "figma", "피그마", "프로덕트 디자이너",
    "사용자 경험", "사용성", "인터페이스", "와이어프레임", "프로토타입",
    "리서치", "research", "페르소나", "저니맵", "사용자 조사",
    "디자인 시스템", "컴포넌트", "스타일 가이드", "토큰",
    "타이포", "폰트", "서체", "컬러", "색상", "아이콘", "레이아웃",
    "그리드", "반응형", "인터랙션", "모션", "애니메이션",
    "접근성", "기획", "서비스 기획", "정보 설계",
    "일러스트", "비주얼", "브랜딩", "brand",
  ];
  return designKeywords.some((kw) => text.includes(kw));
}

function scoreRelevance(article: ArticleData): number {
  const text = `${article.title} ${article.description}`.toLowerCase();

  // 디자인 관련 키워드가 전혀 없으면 즉시 제외
  if (!hasDesignRelevance(text)) return -100;

  const highPriority = [
    "디자인 시스템", "컬러", "색상", "타이포", "서체", "폰트",
    "여백", "그리드", "레이아웃", "아이콘", "반응형",
    "컴포넌트", "디자인 원리", "ui 패턴", "사용성",
    "접근성", "리서치", "인터랙션", "모션", "간격",
    "정렬", "계층", "hierarchy", "비주얼", "스타일 가이드",
    "디자인 리서치", "ux 리서치", "사용자 조사", "user research",
    "hmw", "how might we", "문제 정의", "페르소나", "저니맵",
    "사용성 테스트", "유저 테스트", "a/b 테스트",
    "데이터 리터러시", "정량 분석", "정성 분석", "인사이트",
    "어피니티", "affinity", "설문 설계",
    "ux 원칙", "ux 법칙", "ux law", "휴리스틱", "닐슨",
    "노먼", "멘탈 모델", "인지 부하", "어포던스",
    "ux 라이팅", "ux writing", "마이크로카피",
    "정보 설계", "ia 설계", "사용자 플로우", "user flow",
    "와이어프레임", "프로토타입", "서비스 기획", "고객 여정",
  ];
  const lowPriority = [
    "출시", "업데이트", "버전", "가격", "구독",
    "ai 도구", "신기능", "트렌드", "전망", "예측",
  ];

  let score = 0;
  for (const kw of highPriority) if (text.includes(kw)) score += 3;
  for (const kw of lowPriority) if (text.includes(kw)) score -= 1;

  const baseKeywords = ["ux", "ui", "디자인", "figma", "피그마", "프로덕트"];
  if (baseKeywords.some((kw) => text.includes(kw))) score += 1;

  // 국내 디자인 전문 소스 가산 (+2)
  const url = article.url.toLowerCase();
  const koreanDesignSources = ["mag.surfit.io", "brunch.co.kr"];
  if (koreanDesignSources.some((d) => url.includes(d))) score += 2;

  // 해외 Medium 감점 (-2)
  if (url.includes("medium.com/")) score -= 2;

  return score;
}

function parseRSS(xml: string, defaultCategory: string): ArticleData[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const articles: ArticleData[] = [];

  $("item").each((_, el) => {
    const title = $(el).find("title").text().trim();
    const link = $(el).find("link").text().trim() || $(el).find("guid").text().trim();
    const description = $(el).find("description").text().trim().replace(/<[^>]*>/g, "").slice(0, 200);
    const author = $(el).find("dc\\:creator").text().trim() || $(el).find("author").text().trim() || null;
    const pubDate = $(el).find("pubDate").text().trim();
    const thumbnail =
      $(el).find("media\\:thumbnail").attr("url") ||
      $(el).find("media\\:content").attr("url") ||
      $(el).find("enclosure").attr("url") || null;

    if (title && link) {
      const category = classifyCategory(title, description, defaultCategory);
      articles.push({
        title, description: description || "", url: link,
        thumbnail_url: thumbnail, author,
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category,
      });
    }
  });

  if (articles.length === 0) {
    $("entry").each((_, el) => {
      const title = $(el).find("title").text().trim();
      const link = $(el).find("link").attr("href") || "";
      const summary = $(el).find("summary, content").text().trim().replace(/<[^>]*>/g, "").slice(0, 200);
      const author = $(el).find("author name").text().trim() || null;
      const updated = $(el).find("updated, published").text().trim();

      if (title && link) {
        const category = classifyCategory(title, summary, defaultCategory);
        articles.push({
          title, description: summary || "", url: link,
          thumbnail_url: null, author,
          published_at: updated ? new Date(updated).toISOString() : new Date().toISOString(),
          category,
        });
      }
    });
  }

  return articles;
}

async function extractOGMetadata(url: string): Promise<Partial<ArticleData>> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ArticleBot/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return {};
    const html = await res.text();
    const $ = cheerio.load(html);
    return {
      thumbnail_url:
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") || null,
      author:
        $('meta[name="author"]').attr("content") ||
        $('meta[property="article:author"]').attr("content") || null,
    };
  } catch { return {}; }
}

// 카테고리를 3개 대그룹으로 매핑
type BucketName = "uxui" | "research" | "designsystem";

function toBucket(category: string): BucketName {
  if (category === "디자인 시스템") return "designsystem";
  if (category === "사용자 리서치") return "research";
  return "uxui"; // 나머지 전부
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode"); // "cleanup" | "collect" | default (both)

  try {
    const supabase = createAdminClient();

    // ── STEP 0: 기존 비디자인 아티클 정리 ──
    let cleanedCount = 0;
    const cleanedTitles: string[] = [];
    if (mode !== "collect") {
      const { data: allExisting } = await supabase.from("articles").select("id, title, description, url");
      if (allExisting) {
        const toDelete: string[] = [];
        for (const a of allExisting) {
          const title = (a.title || "").toLowerCase();
          const titleAndDesc = `${a.title || ""} ${a.description || ""}`.toLowerCase();
          const articleUrl = (a.url || "").toLowerCase();

          // 제목 기반 엄격 판단: 제목에 디자인 관련 키워드가 있어야 함
          const titleHasDesign = [
            "디자인", "design", "ux", "ui", "피그마", "figma", "프로토타입",
            "와이어프레임", "리서치", "사용자", "사용성", "인터페이스",
            "컬러", "색상", "타이포", "폰트", "서체", "아이콘", "레이아웃",
            "반응형", "인터랙션", "모션", "애니메이션", "접근성",
            "컴포넌트", "스타일 가이드", "토큰", "일러스트", "비주얼",
            "브랜딩", "기획", "product", "프로덕트 디자이너",
            "a/b 테스트", "ab테스트", "히트맵", "페르소나", "저니맵",
          ].some((kw) => title.includes(kw));

          // 디자인 전문 소스는 유지 (brunch 디자인 키워드, surfit, yozm)
          const isDesignSource = ["brunch.co.kr", "mag.surfit.io", "yozm.wishket.com"].some((d) => articleUrl.includes(d));

          // 확실한 비디자인 키워드 (제목 기반)
          const isDevArticle = [
            "보안", "서버", "api", "batch", "kafka", "redis",
            "kubernetes", "docker", "인프라", "배포", "트랜잭션",
            "데이터베이스", "sql", "캐싱", "레거시", "정산",
            "머신러닝", "딥러닝", "llm", "모델 개발", "채용",
            "코딩 테스트", "알고리즘", "파이프라인",
            "e2e 자동화", "아키텍처", "마이크로서비스",
            "취약점", "webhook", "terraform",
            "앰배서더", "인턴십", "기술세션 영상",
          ].some((kw) => title.includes(kw));

          // 삭제 조건: 제목에 디자인 키워드 없고, 디자인 소스도 아니면 삭제
          // 또는 확실한 개발 아티클이면 삭제
          if (isDevArticle || (!titleHasDesign && !isDesignSource)) {
            toDelete.push(a.id);
            cleanedTitles.push(a.title);
          }
        }
        if (toDelete.length > 0) {
          for (let i = 0; i < toDelete.length; i += 10) {
            const batch = toDelete.slice(i, i + 10);
            await supabase.from("articles").delete().in("id", batch);
          }
          cleanedCount = toDelete.length;
        }
      }
    }

    if (mode === "cleanup") {
      return NextResponse.json({ success: true, cleanedCount, cleanedTitles });
    }

    // ── STEP 1: RSS 수집 ──
    const allArticles: ArticleData[] = [];
    const sourceStats: Record<string, number> = {};
    const results = await Promise.allSettled(
      RSS_SOURCES.map(async (source) => {
        try {
          const res = await fetch(source.url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; ArticleBot/1.0)" },
            signal: AbortSignal.timeout(10000),
          });
          if (!res.ok) {
            sourceStats[source.name] = -1; // fetch failed
            return [];
          }
          const parsed = parseRSS(await res.text(), source.category);
          sourceStats[source.name] = parsed.length;
          return parsed;
        } catch {
          sourceStats[source.name] = -1;
          return [];
        }
      })
    );
    for (const r of results) if (r.status === "fulfilled") allArticles.push(...r.value);

    // ── STEP 2: 엄격한 필터링 (score > 0 + 디자인 관련 필수) ──
    const scored = allArticles
      .map((a) => ({ ...a, score: scoreRelevance(a) }))
      .filter((a) => a.score > 0);

    // ── STEP 3: 중복 제거 ──
    const { data: existing } = await supabase.from("articles").select("url");
    const existingUrls = new Set((existing || []).map((a) => a.url));
    const seen = new Set<string>();
    const unique = scored.filter((a) => {
      if (existingUrls.has(a.url) || seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    });

    // ── STEP 4: 버킷 분류 & 비율 선택 ──
    const buckets: Record<BucketName, typeof unique> = {
      uxui: [],
      research: [],
      designsystem: [],
    };
    for (const a of unique) {
      buckets[toBucket(a.category)].push(a);
    }
    for (const key of Object.keys(buckets) as BucketName[]) {
      buckets[key].sort((a, b) => b.score - a.score);
    }

    // 목표: UX/UI 50, 리서치 30, 디자인시스템 20 (가용량에 맞춰 조정)
    const TARGET = { uxui: 50, research: 30, designsystem: 20 };
    const TOTAL = 100;

    const toInsert: ArticleData[] = [];
    for (const key of Object.keys(TARGET) as BucketName[]) {
      const take = Math.min(TARGET[key], buckets[key].length);
      toInsert.push(...buckets[key].slice(0, take));
    }

    // 목표 미달 시 다른 버킷에서 보충
    if (toInsert.length < TOTAL) {
      const usedUrls = new Set(toInsert.map((a) => a.url));
      const leftover = unique
        .filter((a) => !usedUrls.has(a.url))
        .sort((a, b) => b.score - a.score);
      toInsert.push(...leftover.slice(0, TOTAL - toInsert.length));
    }

    // ── STEP 5: OG 메타데이터 보강 (10개씩 동시) ──
    const CONCURRENCY = 10;
    for (let i = 0; i < toInsert.length; i += CONCURRENCY) {
      await Promise.allSettled(
        toInsert.slice(i, i + CONCURRENCY).map(async (article, idx) => {
          if (!article.thumbnail_url) {
            const og = await extractOGMetadata(article.url);
            if (og.thumbnail_url) toInsert[i + idx] = { ...toInsert[i + idx], ...og, url: toInsert[i + idx].url };
          }
        })
      );
    }

    // ── STEP 6: DB 삽입 ──
    let insertedCount = 0;
    const insertedArticles: ArticleData[] = [];
    const failedArticles: string[] = [];

    for (const article of toInsert) {
      const { error } = await supabase.from("articles").insert({
        title: article.title,
        description: article.description || null,
        url: article.url,
        thumbnail_url: article.thumbnail_url || null,
        author: article.author || null,
        published_at: article.published_at,
        category: article.category || null,
      });
      if (!error) {
        insertedCount++;
        insertedArticles.push(article);
      } else {
        failedArticles.push(`${article.title}: ${error.message}`);
      }
    }

    // ── 통계 ──
    const stats = {
      cleanedCount,
      totalFetched: allArticles.length,
      afterScoring: scored.length,
      afterDedup: unique.length,
      bucketSizes: {
        uxui: buckets.uxui.length,
        research: buckets.research.length,
        designsystem: buckets.designsystem.length,
      },
      selected: toInsert.length,
      inserted: insertedCount,
      failed: failedArticles.length,
      categoryBreakdown: insertedArticles.reduce((acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      sourceStats,
    };

    return NextResponse.json({
      success: true,
      stats,
      failedArticles: failedArticles.slice(0, 10),
      articles: insertedArticles.map((a) => ({
        title: a.title, url: a.url, category: a.category, score: scoreRelevance(a),
      })),
    });
  } catch (error) {
    console.error("[BulkCollect] Error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
