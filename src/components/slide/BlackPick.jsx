import ImageBox from "../ImageBox";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CommonSlider from "../commonSlider";
import { useNavigate } from "react-router-dom";

export default function BlackPick() {
  const navigate = useNavigate();

  const pickItems = [
    { src: "src/assets/pickImages/r1.png", id: 10 },
    { src: "src/assets/pickImages/r2.png", id: 22 },
    { src: "src/assets/pickImages/r3.png", id: 31 },
    { src: "src/assets/pickImages/r4.png", id: 27 },
    { src: "src/assets/pickImages/r5.png", id: 30 },
    { src: "src/assets/pickImages/r6.png", id: 32 },
  ].map((pick, index) => (
    <div
      key={index}
      onClick={() => navigate(`/restaurant/서울/details/${pick.id}`)}
    >
      <ImageBox
        key={index}
        imageSrc={pick.src}
        divClass={"mr-2 hover:brightness-95"}
      />
    </div>
  ));

  return (
    <div id="black-pick" className="mt-10 shadow-lg">
      <div className="mb-4">
        <p className="">이번 주 식당 PICK</p>
        <p className="text-sm opacity-40">
          나를 위한 근사한 장소, 오늘은 더욱 특별하게.
        </p>
      </div>
      <div className="bg-neutral-100">
        <CommonSlider items={pickItems} sliderId="#black-pick" />
      </div>
    </div>
  );
}
