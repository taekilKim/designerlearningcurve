import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Resend } from "resend";
import { normalizeArticleUrl } from "@/lib/article-url";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const TARGET_INSERT_COUNT = 10;
const MAX_PER_SOURCE_FIRST_PASS = 1;
const MAX_PER_SOURCE_SECOND_PASS = 2;

const NOTIFY_EMAIL = "taekil.design@gmail.com";

// RSS feeds — 디자인 테크닉/학습 중심, 국내 소스 우선
const RSS_SOURCES = [
  // ── 브런치 (디자인 원리/테크닉 키워드) ──
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

  // ── 국내 디자인 커뮤니티 & 매거진 ──
  { name: "서핏 매거진", url: "https://mag.surfit.io/feed", category: "프로덕트 디자인" },
  { name: "요즘IT", url: "https://yozm.wishket.com/magazine/feed/", category: "프로덕트 디자인" },
  { name: "DISQUIET", url: "https://disquiet.io/rss", category: "프로덕트 디자인" },

  // ── 국내 IT 기업 테크블로그 ──
  { name: "토스 테크", url: "https://toss.tech/rss.xml", category: "프로덕트 디자인" },
  { name: "당근 테크", url: "https://medium.com/feed/daangn", category: "프로덕트 디자인" },
  { name: "우아한형제들", url: "https://techblog.woowahan.com/feed", category: "프로덕트 디자인" },
  { name: "카카오 테크", url: "https://tech.kakao.com/feed", category: "프로덕트 디자인" },
  { name: "네이버 D2", url: "https://d2.naver.com/d2.atom", category: "프로덕트 디자인" },
  { name: "뱅크샐러드", url: "https://medium.com/feed/banksalad", category: "프로덕트 디자인" },
  { name: "딜라이트룸", url: "https://medium.com/feed/delightroom", category: "프로덕트 디자인" },
  { name: "강남언니", url: "https://blog.gangnamunni.com/feed.xml", category: "프로덕트 디자인" },
  { name: "쿠팡 엔지니어링", url: "https://medium.com/feed/coupang-engineering", category: "프로덕트 디자인" },
  { name: "여기어때 테크", url: "https://techblog.gccompany.co.kr/feed", category: "프로덕트 디자인" },

  // ── velog ──
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

function safeDomainFromUrl(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

function normalizeTitleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();
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

// 디자인 테크닉/학습 관련성 판단 + 도구 비중 조절
function scoreRelevance(article: ArticleData): number {
  const text = `${article.title} ${article.description}`.toLowerCase();

  // 높은 점수: 디자인 원리/테크닉/리서치
  const highPriority = [
    "디자인 시스템", "컬러", "색상", "타이포", "서체", "폰트",
    "여백", "그리드", "레이아웃", "아이콘", "반응형",
    "컴포넌트", "디자인 원리", "ui 패턴", "사용성",
    "접근성", "리서치", "인터랙션", "모션", "간격",
    "정렬", "계층", "hierarchy", "비주얼", "스타일 가이드",
    // 리서치 & UX 방법론
    "디자인 리서치", "ux 리서치", "사용자 조사", "user research",
    "hmw", "how might we", "문제 정의", "페르소나", "저니맵",
    "사용성 테스트", "유저 테스트", "a/b 테스트",
    "데이터 리터러시", "정량 분석", "정성 분석", "인사이트",
    "어피니티", "affinity", "설문 설계",
    // UX 원칙 & 이론
    "ux 원칙", "ux 법칙", "ux law", "휴리스틱", "닐슨",
    "노먼", "멘탈 모델", "인지 부하", "어포던스",
    "ux 라이팅", "ux writing", "마이크로카피",
    // 설계 & 프로세스
    "정보 설계", "ia 설계", "사용자 플로우", "user flow",
    "와이어프레임", "프로토타입", "서비스 기획", "고객 여정",
  ];

  // 낮은 점수: 도구/트렌드/뉴스
  const lowPriority = [
    "출시", "업데이트", "버전", "가격", "구독",
    "ai 도구", "신기능", "트렌드", "전망", "예측",
  ];

  let score = 0;

  // 개발 전용 글 제외 (-10점 → 사실상 필터링)
  const devOnly = [
    "backend", "백엔드", "서버 개발", "spring", "node.js", "express",
    "kubernetes", "k8s", "docker", "devops", "ci/cd", "jenkins",
    "database", "데이터베이스", "sql", "mongodb", "redis",
    "machine learning", "머신러닝", "딥러닝", "deep learning",
    "알고리즘 문제", "코딩 테스트", "leetcode",
    "ios 개발", "android 개발", "swift", "kotlin",
    "인프라", "terraform", "aws lambda", "배포 자동화",
  ];
  if (devOnly.some((kw) => text.includes(kw))) score -= 10;
  for (const kw of highPriority) if (text.includes(kw)) score += 3;
  for (const kw of lowPriority) if (text.includes(kw)) score -= 1;

  // 기본 관련성 체크
  const baseKeywords = ["ux", "ui", "디자인", "figma", "피그마", "프로덕트"];
  if (baseKeywords.some((kw) => text.includes(kw))) score += 1;

  // ── 출처별 가산/감점 ──
  const url = article.url.toLowerCase();

  // 국내 디자인 전문 소스 가산 (+3)
  const koreanDesignSources = ["mag.surfit.io", "brunch.co.kr"];
  if (koreanDesignSources.some((d) => url.includes(d))) score += 3;

  // 국내 IT 기업 블로그 가산 (+2)
  const koreanTechBlogs = [
    "toss.tech", "techblog.woowahan.com", "tech.kakao.com",
    "d2.naver.com", "blog.gangnamunni.com", "techblog.gccompany.co.kr",
    "devblog.kakaostyle.com",
  ];
  if (koreanTechBlogs.some((d) => url.includes(d))) score += 2;

  // 국내 기업 Medium 블로그 (한국어 콘텐츠) 가산 (+1)
  const koreanMediumPubs = ["/daangn", "/banksalad", "/delightroom", "/coupang-engineering"];
  if (url.includes("medium.com") && koreanMediumPubs.some((p) => url.includes(p))) score += 1;

  // 국내 커뮤니티 가산 (+1)
  const koreanCommunity = ["yozm.wishket.com", "disquiet.io", "velog.io"];
  if (koreanCommunity.some((d) => url.includes(d))) score += 1;

  return score;
}

function parseRSS(xml: string, defaultCategory: string): ArticleData[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const articles: ArticleData[] = [];

  // RSS 2.0 <item> 파싱
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

  // Atom <entry> 파싱 (네이버 D2 등)
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

    // 2. URL 정규화 + 배치 내 중복 제거
    //    같은 아티클이 파라미터/앵커만 다른 URL로 반복 수집되는 문제 방지
    const uniqueByKey = new Map<string, ArticleData>();
    for (const raw of candidates) {
      const normalizedUrl = normalizeArticleUrl(raw.url);
      if (!normalizedUrl) continue;
      const domain = safeDomainFromUrl(normalizedUrl);
      const titleKey = normalizeTitleKey(raw.title);
      const dedupKey = `${domain}|${titleKey}`;

      const candidate: ArticleData = { ...raw, url: normalizedUrl };
      const prev = uniqueByKey.get(dedupKey);
      if (!prev) {
        uniqueByKey.set(dedupKey, candidate);
        continue;
      }

      const prevScore = scoreRelevance(prev);
      const currentScore = scoreRelevance(candidate);
      if (currentScore > prevScore) {
        uniqueByKey.set(dedupKey, candidate);
      } else if (currentScore === prevScore) {
        const prevTime = Date.parse(prev.published_at);
        const currentTime = Date.parse(candidate.published_at);
        if (!Number.isNaN(currentTime) && (Number.isNaN(prevTime) || currentTime > prevTime)) {
          uniqueByKey.set(dedupKey, candidate);
        }
      }
    }
    candidates = [...uniqueByKey.values()];

    // 3. 관련성 스코어링 (0 이하 제외)
    candidates = candidates.filter((a) => scoreRelevance(a) > 0);

    // 4. 기존 데이터 기준 중복 제거 (URL + 소스별 제목 키)
    const { data: existing } = await supabase.from("articles").select("url,title");
    const existingUrls = new Set(
      (existing || [])
        .map((a) => normalizeArticleUrl(a.url))
        .filter(Boolean)
    );
    const existingTitleKeys = new Set(
      (existing || []).map((a) => {
        const domain = safeDomainFromUrl(a.url);
        return `${domain}|${normalizeTitleKey(a.title ?? "")}`;
      })
    );

    const newArticles = candidates.filter((a) => {
      const normalizedUrl = normalizeArticleUrl(a.url);
      const domain = safeDomainFromUrl(normalizedUrl);
      const titleKey = `${domain}|${normalizeTitleKey(a.title)}`;
      return !existingUrls.has(normalizedUrl) && !existingTitleKeys.has(titleKey);
    });

    // 5. 소스별 분산 선택 (최대 10개)
    //    각 소스 도메인에서 스코어 높은 순으로 라운드로빈
    const bySource = new Map<string, ArticleData[]>();
    for (const a of newArticles) {
      const domain = safeDomainFromUrl(a.url);
      const list = bySource.get(domain) || [];
      list.push(a);
      bySource.set(domain, list);
    }
    for (const list of bySource.values()) {
      list.sort((a, b) => scoreRelevance(b) - scoreRelevance(a));
    }
    const toInsert: ArticleData[] = [];
    const selectedCountBySource = new Map<string, number>();
    const sourceOrder = [...bySource.keys()];

    const pickByRoundRobin = (maxPerSource: number) => {
      if (sourceOrder.length === 0) return;

      let hasPickedInRound = true;
      while (toInsert.length < TARGET_INSERT_COUNT && hasPickedInRound) {
        hasPickedInRound = false;
        for (const source of sourceOrder) {
          if (toInsert.length >= TARGET_INSERT_COUNT) break;

          const picked = selectedCountBySource.get(source) ?? 0;
          if (picked >= maxPerSource) continue;

          const queue = bySource.get(source);
          if (!queue || queue.length === 0) continue;

          const next = queue.shift();
          if (!next) continue;

          toInsert.push(next);
          selectedCountBySource.set(source, picked + 1);
          hasPickedInRound = true;
        }
      }
    };

    // Pass 1: 소스 다양성 우선 (소스당 1개)
    pickByRoundRobin(MAX_PER_SOURCE_FIRST_PASS);
    // Pass 2: 부족 시 보강 (소스당 최대 2개)
    pickByRoundRobin(MAX_PER_SOURCE_SECOND_PASS);

    // 6. OG 메타데이터 보강
    const enriched = await Promise.all(
      toInsert.map(async (article) => {
        if (!article.thumbnail_url) {
          const og = await extractOGMetadata(article.url);
          return { ...article, ...og, url: article.url };
        }
        return article;
      })
    );

    // 7. DB 삽입
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

    // 8. 이메일 발송
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
