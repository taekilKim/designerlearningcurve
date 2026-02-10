import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NOTIFY_EMAIL = "taekil.design@gmail.com";

// RSS feeds — 디자인 테크닉/학습 중심으로 확장
const RSS_SOURCES = [
  // 브런치 - 디자인 원리/테크닉 키워드
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
  // 요즘IT
  { name: "요즘IT", url: "https://yozm.wishket.com/magazine/feed/", category: "프로덕트 디자인" },
  // Medium
  { name: "Medium UX", url: "https://medium.com/feed/tag/ux-design", category: "UX 디자인" },
  { name: "Medium UI", url: "https://medium.com/feed/tag/ui-design", category: "UI 디자인" },
  { name: "Medium Design Systems", url: "https://medium.com/feed/tag/design-systems", category: "디자인 시스템" },
  // velog
  { name: "velog UXUI", url: "https://v2.velog.io/rss/tag/UXUI", category: "UX 디자인" },
  { name: "velog 디자인", url: "https://v2.velog.io/rss/tag/%EB%94%94%EC%9E%90%EC%9D%B8", category: "UI 디자인" },
  { name: "velog Figma", url: "https://v2.velog.io/rss/tag/figma", category: "피그마 실무" },
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

// 키워드 기반 카테고리 자동 분류
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
    [["리서치", "research", "인터뷰", "사용성 테스트", "유저 테스트", "페르소나"], "사용자 리서치"],
    [["인터랙션", "interaction", "모션", "애니메이션", "마이크로인터랙션", "트랜지션"], "인터랙션 디자인"],
    [["프로덕트", "product", "서비스 디자인", "ux 전략"], "프로덕트 디자인"],
    [["ui 원리", "ui 패턴", "ui 컴포넌트", "버튼", "입력 필드", "네비게이션", "카드 디자인"], "UI 디자인"],
    [["ux 원칙", "사용자 경험", "휴리스틱", "어포던스", "접근성"], "UX 디자인"],
  ];

  for (const [keywords, category] of rules) {
    if (keywords.some((kw) => text.includes(kw))) return category;
  }
  return fallback;
}

// 디자인 테크닉/학습 관련성 판단 + 도구 비중 조절
function scoreRelevance(article: ArticleData): number {
  const text = `${article.title} ${article.description}`.toLowerCase();

  // 높은 점수: 디자인 원리/테크닉
  const highPriority = [
    "디자인 시스템", "컬러", "색상", "타이포", "서체", "폰트",
    "여백", "그리드", "레이아웃", "아이콘", "반응형",
    "컴포넌트", "디자인 원리", "ui 패턴", "사용성",
    "접근성", "리서치", "인터랙션", "모션", "간격",
    "정렬", "계층", "hierarchy", "비주얼", "스타일 가이드",
  ];

  // 낮은 점수: 도구/트렌드/뉴스
  const lowPriority = [
    "출시", "업데이트", "버전", "가격", "구독",
    "ai 도구", "신기능", "트렌드", "전망", "예측",
  ];

  let score = 0;
  for (const kw of highPriority) if (text.includes(kw)) score += 3;
  for (const kw of lowPriority) if (text.includes(kw)) score -= 1;

  // 기본 관련성 체크
  const baseKeywords = ["ux", "ui", "디자인", "figma", "피그마", "프로덕트"];
  if (baseKeywords.some((kw) => text.includes(kw))) score += 1;

  // 해외 아티클 비중 낮추기 (번역 필요 → 학습 난이도 상승)
  const url = article.url.toLowerCase();
  if (url.includes("medium.com")) score -= 3;

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

  return articles;
}

async function extractOGMetadata(url: string): Promise<Partial<ArticleData>> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ArticleBot/1.0)" },
      signal: AbortSignal.timeout(8000),
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

async function fetchFromRSS(): Promise<ArticleData[]> {
  const allArticles: ArticleData[] = [];
  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      try {
        const res = await fetch(source.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; ArticleBot/1.0)" },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) return [];
        return parseRSS(await res.text(), source.category);
      } catch {
        console.log(`[Cron] Failed: ${source.name}`);
        return [];
      }
    })
  );
  for (const r of results) if (r.status === "fulfilled") allArticles.push(...r.value);
  return allArticles;
}

async function sendNotification(articles: ArticleData[]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  const rows = articles.map((a) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">
      <a href="${a.url}" style="color:#2563eb;text-decoration:none;font-weight:600;">${a.title}</a>
      <br><span style="color:#888;font-size:13px;">${a.author || "알 수 없음"} · ${a.category}</span>
    </td></tr>`
  ).join("");

  await resend.emails.send({
    from: "DLC Bot <onboarding@resend.dev>",
    to: NOTIFY_EMAIL,
    subject: `[DLC] ${articles.length}개 새 아티클 추가됨 (${now})`,
    html: `<div style="font-family:'Pretendard',sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#111;">새로 추가된 UX/UI 아티클</h2>
      <p style="color:#666;">${now} 기준 ${articles.length}개 아티클이 자동 수집되었습니다.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">${rows}</table>
      <p style="color:#aaa;font-size:12px;margin-top:24px;">Designer Learning Curve 자동 수집 시스템</p>
    </div>`,
  });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    // 1. RSS 수집
    let candidates = await fetchFromRSS();

    // 2. 관련성 스코어링 (0 이하 제외)
    candidates = candidates.filter((a) => scoreRelevance(a) > 0);

    // 3. 중복 제거
    const { data: existing } = await supabase.from("articles").select("url");
    const existingUrls = new Set((existing || []).map((a) => a.url));
    const newArticles = candidates.filter((a) => !existingUrls.has(a.url));

    // 4. 스코어 높은 순 정렬, 최대 10개
    const toInsert = newArticles
      .sort((a, b) => scoreRelevance(b) - scoreRelevance(a))
      .slice(0, 10);

    // 5. OG 메타데이터 보강
    const enriched = await Promise.all(
      toInsert.map(async (article) => {
        if (!article.thumbnail_url) {
          const og = await extractOGMetadata(article.url);
          return { ...article, ...og, url: article.url };
        }
        return article;
      })
    );

    // 6. DB 삽입
    let insertedCount = 0;
    const insertedArticles: ArticleData[] = [];
    for (const article of enriched) {
      const { error } = await supabase.from("articles").insert({
        title: article.title, description: article.description || null,
        url: article.url, thumbnail_url: article.thumbnail_url || null,
        author: article.author || null, published_at: article.published_at,
        category: article.category || null,
      });
      if (!error) { insertedCount++; insertedArticles.push(article); }
      else console.log(`[Cron] Failed: "${article.title}":`, error.message);
    }

    // 7. 이메일 발송
    if (insertedArticles.length > 0) await sendNotification(insertedArticles);

    return NextResponse.json({
      success: true, inserted: insertedCount,
      candidates: candidates.length,
      articles: insertedArticles.map((a) => ({ title: a.title, url: a.url, category: a.category })),
    });
  } catch (error) {
    console.error("[Cron] Error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
