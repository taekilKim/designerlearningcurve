const TRACKING_PARAM_PREFIXES = ["utm_"];
const TRACKING_PARAM_KEYS = new Set([
  "fbclid",
  "gclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "si",
]);

export function normalizeArticleUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return trimmed;
  }

  // Remove hash fragments and tracking query params so one article maps to one URL.
  url.hash = "";

  const keptParams: Array<[string, string]> = [];
  for (const [key, value] of url.searchParams.entries()) {
    const lowerKey = key.toLowerCase();
    const isTrackingPrefix = TRACKING_PARAM_PREFIXES.some((prefix) =>
      lowerKey.startsWith(prefix)
    );
    if (isTrackingPrefix || TRACKING_PARAM_KEYS.has(lowerKey)) {
      continue;
    }
    keptParams.push([key, value]);
  }

  keptParams.sort(([aKey, aValue], [bKey, bValue]) => {
    if (aKey === bKey) return aValue.localeCompare(bValue);
    return aKey.localeCompare(bKey);
  });

  url.search = "";
  for (const [key, value] of keptParams) {
    url.searchParams.append(key, value);
  }

  url.hostname = url.hostname.toLowerCase();
  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  if (
    (url.protocol === "http:" && url.port === "80") ||
    (url.protocol === "https:" && url.port === "443")
  ) {
    url.port = "";
  }

  return url.toString();
}
