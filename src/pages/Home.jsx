import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Calendar from "../components/Calendar";
import HomeMap from "../components/HomeMap";
import BlackPick from "../components/slide/BlackPick";
import PopularRegion from "../components/slide/PopularRegion";
import Title from "../components/Title";
import { useShowMobile } from "../hooks/useShowMobile";


export default function Home() {

  const { showMobile } = useShowMobile();
  const navigate = useNavigate();

  return (
    <>
      <div>
        <Title />
        <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
          {showMobile ?
            <div
              id="recommend"
              className="cursor-pointer hover:brightness-90"
              onClick={() => navigate('/recommend-menu')}
            >
              <p>메뉴 추천</p>
              <img src="src\assets\recommendMenuMobile.png" className="rounded-lg" />
            </div> :
            <div
              id="recommend"
              className="cursor-pointer hover:brightness-90"
              onClick={() => navigate('/recommend-menu')}
            >
              <p>메뉴 추천</p>
              <img src="src\assets\recommendMenu.png" className="rounded-lg" />
            </div>
          }

          <BlackPick />
          <PopularRegion />
          <HomeMap />
        </div>
      </div>
    </>
  );
}
