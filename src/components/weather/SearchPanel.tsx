import React from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

interface SearchPanelProps {
  searchValue: string;
  setSearchValue: (val: string) => void;
  handleSearch: () => void;
  queries: string[];
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  searchValue,
  setSearchValue,
  handleSearch,
  queries,
}) => {
  return (
    <div className="bg-black/30 p-3 sm:p-4 rounded-lg w-full sm:w-80 h-auto sm:h-53 shadow-lg shadow-white/10 mt-4 sm:mt-20">
      <div className="flex gap-1 mb-2">
        <Input
          type="text"
          placeholder="Enter city name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 sm:w-30 shadow-lg bg-black/20 text-white font-medium text-sm sm:text-base"
        />
        <Button
          onClick={handleSearch}
          className="bg-black/20 text-sm sm:text-base px-3 sm:px-4"
        >
          search
        </Button>
      </div>
      <h3 className="text-center text-white font-medium mt-2 text-xs sm:text-sm">
        Previous Searches
      </h3>
      <hr className="border-white/20" />
      <ul className="text-center text-white font-medium mt-2 sm:mt-3 mb-2 space-y-1">
        {queries.slice(-3).map((q, i) => (
          <li
            key={i}
            onClick={() => {
              setSearchValue(q);
              handleSearch();
            }}
            className="text-xs sm:text-sm cursor-pointer hover:text-blue-300"
          >
            {q}
          </li>
        ))}
      </ul>
    </div>
  );
};
