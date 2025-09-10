const API_URL = process.env.REACT_APP_API_URL;
const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;

export interface User {
  name: string;
  username: string;
}

export interface ImageItem {
  id: string;
  alt_description: string;
  urls: { regular: string };
  user: User;
  links: { download: string };
}

// Cache entry type
interface CacheEntry {
  data: ImageItem[];
  timestamp: number;
}

// Latest searched word caches with expiration
const cache = new Map<string, CacheEntry>();
const MAX_CACHE_SIZE = 50;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Abort controllers per request key
const controllers = new Map<string, AbortController>();

function setCache(key: string, value: ImageItem[]) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (typeof firstKey === "string") {
      cache.delete(firstKey);
    }
  }
  cache.set(key, { data: value, timestamp: Date.now() });
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, 300 * (3 - retries))); 
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

export async function fetchImages(
  category: string,
  page: number,
  perPage: number = 10
): Promise<ImageItem[]> {
  if (!API_URL) throw new Error("API_URL is not defined");
  if (!category.trim()) return [];

  const key = `${category}_${page}_${perPage}`;
  const cached = cache.get(key);

  // If cache exists and is fresh → return immediately
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // If cache exists but stale → return old data AND refresh in background
  if (cached) {
    refreshCache(key, category, page, perPage);
    return cached.data;
  }

  // No cache → fetch directly
  return await refreshCache(key, category, page, perPage);
}

async function refreshCache(
  key: string,
  category: string,
  page: number,
  perPage: number
): Promise<ImageItem[]> {
  // Abort previous request for this key
  if (controllers.has(key)) {
    controllers.get(key)!.abort();
  }
  const controller = new AbortController();
  controllers.set(key, controller);

  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
    query: category,
  });

  try {
    const res = await fetchWithRetry(`${API_URL}?${params.toString()}`, {
      headers: { Authorization: `Client-ID ${ACCESS_KEY ?? ""}` },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error("Network response was not ok");

    const json = await res.json();
    console.log(json)
    const results: ImageItem[] = (json.results ?? []).map((item: any) => ({
      id: item.id,
      alt_description: item.alt_description,
      urls: { regular: item.urls.regular },
      user: {
        name: item.user.name,
        username: item.user.username,
      },
      links: { download: item.links.download },
    }));

    setCache(key, results);
    return results;
  } catch (err) {
    // If background refresh fails → keep old cache
    if (cache.has(key)) {
      return cache.get(key)!.data;
    }
    throw err;
  }
}
