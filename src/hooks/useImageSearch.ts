import { useState, useEffect } from "react";
import { fetchImages, ImageItem } from "../utils/fetchImages";

export function useImageSearch(category: string, page: number, perPage: number = 10) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (!category.trim()) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchImages(category, page, perPage);
        setImages(results);
        setTotalPages(10); // TODO: replace with real total_pages if API provides it
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category, page, perPage]);

  return { images, loading, error, totalPages };
}
