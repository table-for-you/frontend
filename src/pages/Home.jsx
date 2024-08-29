import Button from "../components/Button";
import Calendar from "../components/Calendar";
import HomeMap from "../components/HomeMap";
import BlackPick from "../components/slide/BlackPick";
import PopularRegion from "../components/slide/PopularRegion";
import Title from "../components/Title";

export default function Home() {
  return (
    <>
      <div>
        <Title />
        <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
          <BlackPick />
          <PopularRegion />
          <HomeMap />
        </div>
      </div>
    </>
  );
}
