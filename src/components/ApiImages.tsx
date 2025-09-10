import { useEffect, useState } from 'react';
import Loader from './Loader';
import { IoMdDownload } from '@react-icons/all-files/io/IoMdDownload';


const API_URL = process.env.REACT_APP_API_URL;
const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;

interface ApiImagesProps {
    category: string;
    page: number;
    perPage?: number;
    setPage: (page: number) => void;
}

export default function ApiImages({ category, page, perPage = 10, setPage }: ApiImagesProps) {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        if (!API_URL) {
            setError('API_URL is not defined');
            return;
        }

        const params = new URLSearchParams({
            per_page: perPage.toString(),
            page: page.toString(),
            query: category
        });

        fetch(`${API_URL}?${params.toString()}`, {
            headers: {
                Authorization: `Client-ID ${ACCESS_KEY ?? ''}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((json) => {
                setData(json.results ?? []);
                setTotalPages(10);
            })
            .catch((err) => setError(err.message));
    }, [category, page, perPage]);

    return (
        <div>
            {data.length > 0 ? (
                <>
                    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 p-2" >
                        {data.map((item) => (
                            <div key={item.id} className="mb-4 break-inside-avoid border rounded-lg shadow-lg p-2">
                                <img
                                    src={item.urls.regular}
                                    alt={item.alt_description}
                                    className="w-full rounded-lg object-cover"
                                />
                                <div className="mt-2 text-sm text-gray-700">
                                    <p className="font-semibold">{item.user.name}</p>
                                    <p className="text-gray-500 text-xs">@{item.user.username}</p>
                                </div>
                                <div>
                                    <a
                                        href={item.links.download}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#60958F] hover:underline flex items-end justify-end mt-2">
                                        <IoMdDownload />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="mt-6 block text-center">
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
                                className={`px-3 py-1 rounded ${page === i + 1
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
                </>
            ) : (
                error ? <div>Error: {error}</div> : <Loader />
            )}
        </div>
    );
}
