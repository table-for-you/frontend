import { useState } from "react";
import { inputStyle } from "../../constants/style";
import Calendar from "../Calendar";

export default function SearchCalendar() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const onDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowCalendar(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className={`${inputStyle} cursor-pointer text-[1rem] active:bg-white w-full`}
        onClick={() => setShowCalendar(!showCalendar)}
        placeholder="날짜를 선택해 주세요."
        value={selectedDate}
        readOnly
      />
      {showCalendar && (
        <div className="absolute overflow-y-auto rounded-lg bg-white p-2 text-xs w-full z-20">
          <Calendar onDateClick={onDateClick} />
        </div>
      )}
    </div>
  );
}
