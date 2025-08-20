import { useEffect, useState } from 'react';
import Loader from './Loader';
import { IoMdDownload } from '@react-icons/all-files/io/IoMdDownload';
import { fetchImages, ImageItem } from '../utils/fetchImages';


interface ApiImagesProps {
  category: string;
  page: number;
  perPage?: number;
  setPage: (page: number) => void;
}

export default function ApiImages({
  category,
  page,
  perPage = 10,
  setPage,
}: ApiImagesProps) {
  const [data, setData] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchImages(category, page, perPage);
        setData(results);
        setTotalPages(10); // can be dynamic if API provides total_pages
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [category, page, perPage]);

  const renderPagination = () => (
    <div className="mt-6 flex justify-center gap-2 flex-wrap">
      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-[#2E4A47] hover:text-white disabled:opacity-50"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-1 rounded ${
            page === i + 1
              ? "bg-[#60958F] hover:bg-[#2E4A47] text-white"
              : "bg-gray-100 hover:bg-[#2E4A47] hover:text-white"
          }`}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-[#2E4A47] hover:text-white disabled:opacity-50"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;

  return (
    <div>
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 p-2">
        {data.map((item) => (
          <div
            key={item.id}
            className="mb-4 break-inside-avoid border rounded-lg shadow-lg p-2 flex flex-col"
          >
            <img
              src={item.urls?.regular}
              alt={item.alt_description ?? "Image"}
              className="w-full rounded-lg object-cover"
            />

            <div className="mt-2 text-sm text-gray-700">
              <p className="font-semibold">{item.user.name}</p>
              <p className="text-gray-500 text-xs">@{item.user.username}</p>
            </div>

            <div className="mt-auto flex justify-end">
              <a
                href={item.links.download}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#60958F] hover:underline"
              >
                <IoMdDownload />
              </a>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}
    </div>
  );
}