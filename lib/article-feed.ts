interface FeedArticle {
  id: string;
  url: string;
  published_at: string | null;
  created_at: string;
}

function extractSourceHost(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

function interleaveBySource(articles: FeedArticle[]): FeedArticle[] {
  const sourceMap = new Map<string, FeedArticle[]>();

  for (const article of articles) {
    const host = extractSourceHost(article.url);
    const queue = sourceMap.get(host) ?? [];
    queue.push(article);
    sourceMap.set(host, queue);
  }

  const orderedSources = Array.from(sourceMap.entries()).sort((a, b) => {
    const lengthDiff = b[1].length - a[1].length;
    if (lengthDiff !== 0) return lengthDiff;
    return a[0].localeCompare(b[0]);
  });

  const mixed: FeedArticle[] = [];
  let hasItems = true;

  while (hasItems) {
    hasItems = false;
    for (const [, queue] of orderedSources) {
      const next = queue.shift();
      if (!next) continue;
      mixed.push(next);
      hasItems = true;
    }
  }

  return mixed;
}

function chunkByRecency(articles: FeedArticle[], nowMs: number): {
  fresh: FeedArticle[];
  recent: FeedArticle[];
  archive: FeedArticle[];
} {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const freshCutoff = 30 * DAY_MS;
  const recentCutoff = 180 * DAY_MS;

  const fresh: FeedArticle[] = [];
  const recent: FeedArticle[] = [];
  const archive: FeedArticle[] = [];

  for (const article of articles) {
    const baseDate = article.published_at ?? article.created_at;
    const articleMs = Date.parse(baseDate);

    if (Number.isNaN(articleMs)) {
      archive.push(article);
      continue;
    }

    const ageMs = Math.max(0, nowMs - articleMs);
    if (ageMs <= freshCutoff) {
      fresh.push(article);
      continue;
    }
    if (ageMs <= recentCutoff) {
      recent.push(article);
      continue;
    }
    archive.push(article);
  }

  return { fresh, recent, archive };
}

export function buildMixedArticleFeed<T extends FeedArticle>(articles: T[]): T[] {
  if (articles.length <= 1) return articles;

  // First sort by publish/create date so every source queue preserves natural freshness.
  const byDate = [...articles].sort((a, b) => {
    const aDate = Date.parse(a.published_at ?? a.created_at);
    const bDate = Date.parse(b.published_at ?? b.created_at);
    return bDate - aDate;
  });

  const nowMs = Date.now();
  const { fresh, recent, archive } = chunkByRecency(byDate, nowMs);

  const mixedFresh = interleaveBySource(fresh);
  const mixedRecent = interleaveBySource(recent);
  const mixedArchive = interleaveBySource(archive);

  // Keep latest visibility while always pulling some older pieces into the first screen.
  const result: T[] = [];
  const buckets: Array<T[]> = [
    mixedFresh as T[],
    mixedRecent as T[],
    mixedArchive as T[],
  ];
  const pattern = [0, 1, 0, 2, 0, 1];

  while (buckets.some((bucket) => bucket.length > 0)) {
    for (const bucketIndex of pattern) {
      const bucket = buckets[bucketIndex];
      if (!bucket || bucket.length === 0) continue;
      const next = bucket.shift();
      if (next) result.push(next);
    }
  }

  return result;
}
