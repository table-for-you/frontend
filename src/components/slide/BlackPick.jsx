import ImageBox from "../ImageBox";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CommonSlider from "../commonSlider";

export default function BlackPick() {
  const pickItems = [
    { src: "src/assets/pickImages/cocktail.png" },
    { src: "src/assets/pickImages/sushi.png" },
    { src: "src/assets/pickImages/pasta.png" },
    { src: "src/assets/pickImages/pizza.png" },
    { src: "src/assets/pickImages/beef.png" },
    { src: "src/assets/pickImages/rice.png" },
  ].map((pick, index) => (
    <ImageBox key={index} imageSrc={pick.src} divClass={"mr-2"} />
  ));

  return (
    <div id="black-pick" className="mt-16">
      <div className="mb-4">
        <p className="">이번 주 블랙 PICK</p>
        <p className="text-sm opacity-40">
          나를 위한 근사한 장소, 오늘은 더욱 특별하게.
        </p>
      </div>
      <CommonSlider items={pickItems} sliderId="#black-pick" />
    </div>
  );
}
