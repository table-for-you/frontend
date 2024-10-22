import { useState } from "react";
import { inputStyle } from "../../constants/style";
import SearchRank from "./SearchRank";

export default function SearchRestaurant({
  searchInputValue,
  setSearchInputValue,
  onSearch,
}) {
  const [showRank, setShowRank] = useState(false);

  const handleSelectRegion = (region) => {
    setSearchInputValue(region);
    setShowRank(false);
  };

  const handleRegionChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    // 엔터키 입력 감지
    if (e.key === "Enter") {
      onSearch(); // 엔터키 입력 시 검색 함수 호출
    }
  };

  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-2 top-2.5 opacity-45">
        restaurant
      </span>
      <input
        type="text"
        className={`${inputStyle} w-full cursor-pointer pl-8 text-[1rem] active:bg-white`}
        placeholder="원하시는 식당을 검색해 주세요."
        value={searchInputValue}
        onClick={() => setShowRank(!showRank)}
        onChange={handleRegionChange}
        onKeyDown={handleKeyDown}
      />
      {showRank && (
        <div className="absolute z-30 w-full rounded-lg bg-white p-2 text-sm">
          {showRank && <SearchRank onSelectRegion={handleSelectRegion} />}
        </div>
      )}
    </div>
  );
}
