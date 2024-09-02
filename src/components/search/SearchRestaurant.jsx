import { useState } from "react";
import { inputStyle } from "../../constants/style";
import SearchRank from "./SearchRank";

export default function SearchRestaurant() {
  const [rankInputValue, setRankInputValue] = useState("");
  const [showRank, setShowRank] = useState(false);

  const handleSelectRegion = (region) => {
    setRankInputValue(region);
    setShowRank(false);
  };

  const handleRegionChange = (e) => {
    setRankInputValue(e.target.value);
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
        value={rankInputValue}
        onClick={() => setShowRank(!showRank)}
        onChange={handleRegionChange}
      />
      {showRank && (
        <div className="absolute z-30 w-full rounded-lg bg-white p-2 text-sm">
          {showRank && <SearchRank onSelectRegion={handleSelectRegion} />}
        </div>
      )}
    </div>
  );
}
