import { useState } from "react";

export default function Filter({ onFilterChange }) {
  const buttons = ["주차 가능", "한식", "중식", "일식", "양식"];
  const [clickedButtons, setClickedButtons] = useState(
    Array(buttons.length).fill(false),
  );

  const handleClick = (index) => {
    const updatedClickedButtons = [...clickedButtons];
    updatedClickedButtons[index] = !updatedClickedButtons[index];
    setClickedButtons(updatedClickedButtons);

    const selectedFilters = buttons.filter((_, i) => updatedClickedButtons[i]); // 선택된 필터만 배열에 담음
    onFilterChange(selectedFilters);
  };

  return (
    <div className="flex justify-between">
      <div className="flex w-full gap-3 overflow-x-auto whitespace-nowrap text-sm">
        {buttons.map((buttonText, index) => (
          <span
            key={index}
            className={`cursor-pointer rounded-xl border-[1.5px] border-gray-200 px-2 py-1 ${clickedButtons[index] ? "bg-tomato-color text-white" : "bg-white text-black"}`}
            onClick={() => handleClick(index)}
          >
            {buttonText}
          </span>
        ))}
      </div>
    </div>
  );
}
