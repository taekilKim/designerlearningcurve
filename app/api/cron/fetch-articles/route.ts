import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NOTIFY_EMAIL = "taekil.design@gmail.com";

// Korean UX/UI RSS feed sources
const RSS_SOURCES = [
  {
    name: "브런치 UX",
    url: "https://brunch.co.kr/rss/keyword/UX%EB%94%94%EC%9E%90%EC%9D%B8",
    category: "UX 디자인",
  },
  {
    name: "브런치 UI",
    url: "https://brunch.co.kr/rss/keyword/UI%EB%94%94%EC%9E%90%EC%9D%B8",
    category: "UI 디자인",
  },
  {
    name: "브런치 프로덕트디자인",
    url: "https://brunch.co.kr/rss/keyword/%ED%94%84%EB%A1%9C%EB%8D%95%ED%8A%B8%EB%94%94%EC%9E%90%EC%9D%B8",
    category: "프로덕트 디자인",
  },
  {
    name: "요즘IT",
    url: "https://yozm.wishket.com/magazine/feed/",
    category: "프로덕트 디자인",
  },
  {
    name: "Medium UX Korea",
    url: "https://medium.com/feed/tag/ux-design",
    category: "UX 디자인",
  },
  {
    name: "velog UX",
    url: "https://v2.velog.io/rss/tag/UXUI",
    category: "UX 디자인",
  },
];

// Fallback: well-known Korean UX/UI article URLs to scrape
const SCRAPE_SOURCES = [
  { url: "https://yozm.wishket.com/magazine/list/develop/?sort=popular&q=UX+UI+%EB%94%94%EC%9E%90%EC%9D%B8", category: "UX 디자인" },
  { url: "https://disquiet.io/articles?tag=design", category: "프로덕트 디자인" },
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

// Parse RSS XML to extract articles
function parseRSS(xml: string, defaultCategory: string): ArticleData[] {
  const $ = cheerio.load(xml, { xmlMode: true });
  const articles: ArticleData[] = [];

  $("item").each((_, el) => {
    const title = $(el).find("title").text().trim();
    const link =
      $(el).find("link").text().trim() ||
      $(el).find("guid").text().trim();
    const description =
      $(el).find("description").text().trim().replace(/<[^>]*>/g, "").slice(0, 200);
    const author =
      $(el).find("dc\\:creator").text().trim() ||
      $(el).find("author").text().trim() ||
      null;
    const pubDate = $(el).find("pubDate").text().trim();
    const thumbnail =
      $(el).find("media\\:thumbnail").attr("url") ||
      $(el).find("media\\:content").attr("url") ||
      $(el).find("enclosure").attr("url") ||
      null;

    if (title && link) {
      articles.push({
        title,
        description: description || "",
        url: link,
        thumbnail_url: thumbnail,
        author,
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category: defaultCategory,
      });
    }
  });

  return articles;
}

// Extract OG metadata from a URL
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
      title:
        $('meta[property="og:title"]').attr("content") ||
        $("title").text().trim() ||
        undefined,
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        undefined,
      thumbnail_url:
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        null,
      author:
        $('meta[name="author"]').attr("content") ||
        $('meta[property="article:author"]').attr("content") ||
        null,
    };
  } catch {
    return {};
  }
}

// Fetch articles from all RSS sources
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
        const xml = await res.text();
        return parseRSS(xml, source.category);
      } catch {
        console.log(`[Cron] Failed to fetch RSS: ${source.name}`);
        return [];
      }
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  }

  return allArticles;
}

// Filter for UX/UI relevance
function isUXUIRelevant(article: ArticleData): boolean {
  const keywords = [
    "ux", "ui", "디자인", "사용자 경험", "인터페이스",
    "프로덕트", "디자인 시스템", "피그마", "figma",
    "프로토타입", "사용성", "접근성", "인터랙션",
    "wireframe", "와이어프레임", "리서치", "유저",
  ];
  const text = `${article.title} ${article.description}`.toLowerCase();
  return keywords.some((kw) => text.includes(kw));
}

// Send email notification
async function sendNotification(articles: ArticleData[]) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[Cron] RESEND_API_KEY not set, skipping email");
    return;
  }

  const resend = new Resend(apiKey);

  const articleListHtml = articles
    .map(
      (a) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">
            <a href="${a.url}" style="color:#2563eb;text-decoration:none;font-weight:600;">${a.title}</a>
            <br><span style="color:#888;font-size:13px;">${a.author || "알 수 없음"} · ${a.category}</span>
          </td>
        </tr>`
    )
    .join("");

  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  await resend.emails.send({
    from: "DLC Bot <onboarding@resend.dev>",
    to: NOTIFY_EMAIL,
    subject: `[DLC] ${articles.length}개 새 아티클 추가됨 (${now})`,
    html: `
      <div style="font-family:'Pretendard',sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#111;">새로 추가된 UX/UI 아티클</h2>
        <p style="color:#666;">${now} 기준 ${articles.length}개 아티클이 자동 수집되었습니다.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          ${articleListHtml}
        </table>
        <p style="color:#aaa;font-size:12px;margin-top:24px;">Designer Learning Curve 자동 수집 시스템</p>
      </div>
    `,
  });

  console.log(`[Cron] Email sent to ${NOTIFY_EMAIL} with ${articles.length} articles`);
}

// Main handler
export async function GET(request: Request) {
  // Verify cron secret (Vercel Cron sends this header)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // 1. Fetch articles from RSS feeds
    console.log("[Cron] Fetching articles from RSS sources...");
    let candidates = await fetchFromRSS();

    // 2. Filter for UX/UI relevance
    candidates = candidates.filter(isUXUIRelevant);

    // 3. Get existing URLs to avoid duplicates
    const { data: existing } = await supabase
      .from("articles")
      .select("url");
    const existingUrls = new Set((existing || []).map((a) => a.url));

    // 4. Filter out duplicates
    const newArticles = candidates.filter((a) => !existingUrls.has(a.url));

    // 5. Take top 10 (most recent)
    const toInsert = newArticles
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 10);

    // 6. Enrich with OG metadata for missing thumbnails
    const enriched = await Promise.all(
      toInsert.map(async (article) => {
        if (!article.thumbnail_url) {
          const og = await extractOGMetadata(article.url);
          return { ...article, ...og, url: article.url };
        }
        return article;
      })
    );

    // 7. Insert into database
    let insertedCount = 0;
    const insertedArticles: ArticleData[] = [];

    for (const article of enriched) {
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
        console.log(`[Cron] Failed to insert "${article.title}":`, error.message);
      }
    }

    // 8. Send email notification
    if (insertedArticles.length > 0) {
      await sendNotification(insertedArticles);
    }

    console.log(
      `[Cron] Done: ${insertedCount} inserted, ${candidates.length} candidates, ${newArticles.length} new`
    );

    return NextResponse.json({
      success: true,
      inserted: insertedCount,
      candidates: candidates.length,
      articles: insertedArticles.map((a) => ({ title: a.title, url: a.url })),
    });
  } catch (error) {
    console.error("[Cron] Error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
