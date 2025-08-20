import { useState } from "react";

interface SearchProps {
  inputValue: string;
  setSearchCategory: (category: string) => void;
}

export default function Search({ inputValue, setSearchCategory }: SearchProps) {
  const [localInput, setLocalInput] = useState(inputValue);

  const handleSearch = () => {
    const trimmedInput = localInput.trim();
    if (trimmedInput) {
      setSearchCategory(trimmedInput);
    }
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
        aria-label="Search category"
        placeholder="Search category..."
        value={localInput}
        onChange={(e) => setLocalInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#60958F] focus:border-[#60958F]"
      />
      <button
        type="button"
        className="bg-[#60958F] hover:bg-[#2E4A47] px-4 py-2 text-white rounded transition-colors"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}
