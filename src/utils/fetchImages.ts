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

export async function fetchImages(
  category: string,
  page: number,
  perPage: number = 10
): Promise<ImageItem[]> {
  if (!API_URL) throw new Error("API_URL is not defined");

  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
    query: category,
  });

  const res = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY ?? ""}`,
    },
  });

  if (!res.ok) throw new Error("Network response was not ok");

  const json = await res.json();
  return json.results ?? [];
}
