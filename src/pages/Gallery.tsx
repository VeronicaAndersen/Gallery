import { useState } from "react";
import ApiImages from "../components/ApiImages";
import Search from "../components/Search";

export default function Gallery() {
  const [searchCategory, setSearchCategory] = useState("Disney");
  const [page, setPage] = useState(1);

  return (
    <div className="mx-auto p-4 lg:px-32 ">
      <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>
      <Search
        inputValue={searchCategory}
        setSearchCategory={setSearchCategory}
        setPage={setPage}
      />
      <ApiImages category={searchCategory} page={page} setPage={setPage} />
    </div>
  );
}
