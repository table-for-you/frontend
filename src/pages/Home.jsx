import BlackPick from "../components/BlackPick";
import Button from "../components/Button";
import Calendar from "../components/Calendar";
import Title from "../components/Title";

export default function Home() {
  return (
    <>
      <div>
        <Title />
        <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
          {/* 가로 스크롤 생김 수정 필요 */}
          <BlackPick />
        </div>
      </div>
    </>
  );
}
