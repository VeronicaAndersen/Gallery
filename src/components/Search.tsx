import { useState, useEffect, useCallback } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

interface SearchProps {
  setSearchCategory: (category: string) => void;
}

export default function Search({ setSearchCategory }: SearchProps) {
  const [localInput, setLocalInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!hasSearched) {
      setSearchCategory("Disney");
      setHasSearched(true);
    }
  }, [hasSearched, setSearchCategory]);
const debouncedInput = useDebouncedValue(localInput, 500);
  useEffect(() => {
  if (debouncedInput.trim()) {
    setSearchCategory(debouncedInput.trim());
  }
}, [debouncedInput, setSearchCategory]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalInput(e.target.value);
    },
    []
  );

  const handleSearch = useCallback(() => {
    if (localInput.trim()) {
      setSearchCategory(localInput.trim());
    }
  }, [localInput, setSearchCategory]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        aria-label="Search category"
        placeholder="Search category..."
        value={localInput}
        onChange={handleChange}
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
