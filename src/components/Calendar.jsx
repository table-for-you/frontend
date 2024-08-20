import FullCalendar from "@fullcalendar/react"; // 리액트 컴포넌트로 FullCalendar를 임포트
import dayGridPlugin from "@fullcalendar/daygrid"; // dayGrid 뷰 플러그인
import timeGridPlugin from "@fullcalendar/timegrid"; // timeGrid 뷰 플러그인
import interactionPlugin from "@fullcalendar/interaction"; // 이벤트 드래그 & 드롭 등을 위한 플러그인
import koLocale from "@fullcalendar/core/locales/ko";

export default function Calendar({ onDateClick }) {
  const offset = 1000 * 60 * 60 * 9;
  const koreaNow = new Date(new Date().getTime() + offset);

  const todayStr = koreaNow.toISOString().split("T")[0];

  const dayCellClassNames = ({ date }) => {
    const day = date.getDay(); // 요일을 숫자로 반환 (일요일: 0, 월요일: 1, ..., 토요일: 6)
    if (day === 0) {
      return "sunday-cell"; // 일요일인 경우 클래스 추가
    } else if (day === 6) {
      return "saturday-cell"; // 토요일인 경우 클래스 추가
    }
    return "";
  };
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // 사용할 플러그인 배열
      initialView="dayGridMonth" // 초기 뷰 설정
      editable={true} // 이벤트 드래그 & 드롭 가능 여부
      selectable={true} // 날짜 선택 가능 여부
      locale={koLocale}
      dayCellContent={({ date }) => date.getDate()}
      dateClick={onDateClick}
      dayCellClassNames={dayCellClassNames}
      validRange={{
        start: todayStr,
      }}
    /> //지역 순위 클릭
  );
}
