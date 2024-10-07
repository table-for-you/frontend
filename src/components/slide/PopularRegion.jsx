import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import ImageBox from "../ImageBox";
import CommonSlider from "../commonSlider";

export default function PopularRegion() {
  const navigate = useNavigate();
  const handleRegionClick = (name) => {
    navigate(`/restaurant/${name}`);
  };

  const regionItems = [
    { name: "부산", src: "src/assets/PopularRegions/Busan.jpg" },
    { name: "대구", src: "src/assets/PopularRegions/Daegu.jpg" },
    { name: "강릉", src: "src/assets/PopularRegions/Gangneung.jpg" },
    { name: "가평", src: "src/assets/PopularRegions/Gapyeong.jpg" },
    { name: "경주", src: "src/assets/PopularRegions/Gyeongju.jpg" },
    { name: "제주", src: "src/assets/PopularRegions/Jeju.jpg" },
    { name: "전주", src: "src/assets/PopularRegions/Jeonju.jpg" },
    { name: "서울", src: "src/assets/PopularRegions/Seoul.jpg" },
    { name: "속초", src: "src/assets/PopularRegions/Sokcho.jpg" },
    { name: "여수", src: "src/assets/PopularRegions/Yeosu.jpg" },
  ].map((region) => (
    <div key={region.name} onClick={() => handleRegionClick(region.name)}>
      <ImageBox imageSrc={region.src} divClass={"mr-2 hover:brightness-75"} />
      <span className="text-sm">{region.name}</span>
    </div>
  ));

  return (
    <div id="popular-region" className="mt-12">
      <p className="mb-4">인기 지역</p>
      <CommonSlider
        items={regionItems}
        sliderId="#popular-region"
        defaultSlidesToScroll={4}
      />
    </div>
  );
}
