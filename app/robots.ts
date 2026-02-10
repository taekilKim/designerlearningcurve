import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/curriculums"],
      disallow: ["/admin", "/my-learning", "/auth", "/api"],
    },
    sitemap: "https://designpath.vercel.app/sitemap.xml",
  };
}
