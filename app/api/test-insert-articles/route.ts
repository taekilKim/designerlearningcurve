import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const NOTIFY_EMAIL = "taekil.design@gmail.com";

const TEST_ARTICLES = [
  {
    title: "디자인 시스템 다시 생각해보기",
    description:
      "토스 디자인 시스템(TDS) 개발자가 디자인 시스템의 근본적인 문제를 재조명하며, 유연한 API를 통해 사용자 중심의 디자인 시스템 운영 방법을 제안합니다.",
    url: "https://toss.tech/article/rethinking-design-system",
    thumbnail_url: null as string | null,
    author: "토스 TDS팀",
    published_at: "2026-01-08T00:00:00Z",
    category: "디자인 시스템",
  },
  {
    title: "Stitch — 구글 생태계와 함께 어마어마한 업데이트",
    description:
      "Google의 AI 기반 UI 디자인 도구 Stitch의 최신 업데이트 분석. Gemini 3.0 Flash 모델 기반으로 텍스트 프롬프트만으로 UI를 생성하는 혁신적 기능 소개.",
    url: "https://brunch.co.kr/@ghidesigner/405",
    thumbnail_url: null as string | null,
    author: "유훈식",
    published_at: "2026-01-23T00:00:00Z",
    category: "UI 디자인",
  },
  {
    title: "미리 보는 2026년 UI·UX 디자인 트렌드 9가지",
    description:
      "Adobe, Canva 등 주요 디자인 플랫폼의 예측을 종합한 2026년 9가지 UI/UX 트렌드. Anti-Design, 마이크로인터랙션, 공간 컴퓨팅 UX 등 심층 분석.",
    url: "https://ditoday.com/%EB%AF%B8%EB%A6%AC-%EB%B3%B4%EB%8A%94-2026%EB%85%84-ui%C2%B7ux-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8A%B8%EB%A0%8C%EB%93%9C-9%EA%B0%80%EC%A7%80/",
    thumbnail_url: null as string | null,
    author: "디투데이",
    published_at: "2025-12-31T00:00:00Z",
    category: "일반 디자인",
  },
  {
    title: "2026년 UI·UX 트렌드 5가지",
    description:
      "아날로그 감성, 텍스처 UX, 고채도 컬러, 브랜드 시그니처 모션 등 2026년 핵심 UI/UX 트렌드를 통해 더 인간적이고 생생한 사용자 경험 전략을 제시.",
    url: "https://www.soijeong.com/newsletter/view/506",
    thumbnail_url: null as string | null,
    author: "소이정",
    published_at: "2026-01-05T00:00:00Z",
    category: "UX 디자인",
  },
  {
    title: "AI시대, UX/UI디자인하는 방식은 이렇게 변합니다",
    description:
      "AI 기술 발전으로 인한 UX/UI 디자인 업무 방식의 근본적 변화를 조망. 생성형 AI 자동화와 인간 디자이너만의 공감·창의적 경험의 가치를 강조.",
    url: "https://brunch.co.kr/@ghidesigner/244",
    thumbnail_url: null as string | null,
    author: "유훈식",
    published_at: "2025-12-01T00:00:00Z",
    category: "UX 디자인",
  },
];

async function fetchOGImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    return (
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      null
    );
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Check existing URLs to avoid duplicates
    const { data: existing } = await supabase.from("articles").select("url");
    const existingUrls = new Set((existing || []).map((a) => a.url));

    const toInsert = TEST_ARTICLES.filter((a) => !existingUrls.has(a.url));

    if (toInsert.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All test articles already exist",
        inserted: 0,
      });
    }

    // Enrich with OG images
    const enriched = await Promise.all(
      toInsert.map(async (article) => {
        const ogImage = await fetchOGImage(article.url);
        return ogImage ? { ...article, thumbnail_url: ogImage } : article;
      })
    );

    // Insert articles
    const { data, error } = await supabase
      .from("articles")
      .insert(enriched)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Send email notification
    const apiKey = process.env.RESEND_API_KEY;
    let emailSent = false;

    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

        const articleListHtml = enriched
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

        await resend.emails.send({
          from: "DLC Bot <onboarding@resend.dev>",
          to: NOTIFY_EMAIL,
          subject: `[DLC] 테스트: ${enriched.length}개 아티클 추가됨 (${now})`,
          html: `
            <div style="font-family:'Pretendard',sans-serif;max-width:600px;margin:0 auto;">
              <h2 style="color:#111;">테스트: 새로 추가된 UX/UI 아티클</h2>
              <p style="color:#666;">${now} 기준 ${enriched.length}개 아티클이 추가되었습니다.</p>
              <table style="width:100%;border-collapse:collapse;margin-top:16px;">
                ${articleListHtml}
              </table>
              <p style="color:#aaa;font-size:12px;margin-top:24px;">Designer Learning Curve 자동 수집 시스템 (테스트)</p>
            </div>
          `,
        });
        emailSent = true;
      } catch (e) {
        console.error("[Test] Email send failed:", e);
      }
    }

    return NextResponse.json({
      success: true,
      inserted: data?.length || 0,
      emailSent,
      articles: enriched.map((a) => ({ title: a.title, url: a.url })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
