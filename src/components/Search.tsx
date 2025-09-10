import { useState } from "react";

interface SearchProps {
  inputValue: string;
  setSearchCategory: (category: string) => void;
  setPage: (page: number) => void;
}

export default function Search({ inputValue, setSearchCategory, setPage }: SearchProps) {
  const [localInput, setLocalInput] = useState(inputValue);

  const handleSearch = () => {
    setSearchCategory(localInput);
    setPage(1); // Reset to first page
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Search category..."
        value={localInput}
        onChange={(e) => setLocalInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded px-3 py-2 flex-1"
      />
      <button
        className="bg-[#60958F] hover:bg-[#2E4A47] px-4 py-2 text-white rounded"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}
