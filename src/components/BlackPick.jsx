import Slider from "react-slick";
import ImageBox from "./ImageBox";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";

export default function BlackPick() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideLength, setSlideLength] = useState(0);
  const [slideToShow, setSlideToShow] = useState(4);

  useEffect(() => {
    setSlideLength(document.querySelectorAll(".slick-slide").length);
    const handleSize = () => {
      if (window.matchMedia("(max-width: 1024px)").matches) {
        setSlideToShow(3);
      } else if (window.matchMedia("(min-width: 769px").matches) {
        setSlideToShow(4);
      }
    };

    handleSize();

    const mediaQueryLists = [
      window.matchMedia("(max-width: 1024px)"),
      window.matchMedia("(min-width: 769px)"),
    ];

    mediaQueryLists.forEach((mql) => {
      mql.addEventListener("change", handleSize);
    });

    return () => {
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener("change", handleSize);
      });
    };
  }, []);

  const PrevArrow = ({ onClick }) => {
    return (
      <span
        className={
          currentSlide === 0
            ? "hidden"
            : "material-symbols-outlined absolute -left-4 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer rounded-full bg-black p-1 text-white opacity-65"
        }
        onClick={onClick}
      >
        arrow_left
      </span>
    );
  };

  const NextArrow = ({ onClick }) => {
    return (
      <span
        className={
          currentSlide >= slideLength - slideToShow
            ? "hidden"
            : "material-symbols-outlined absolute -right-2 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer rounded-full bg-black p-1 text-white opacity-65"
        }
        onClick={onClick}
      >
        arrow_right
      </span>
    );
  };

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.2,
          arrows: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  };

  return (
    <div id="black-pick">
      <div className="mb-4">
        <p className="">이번 주 블랙 PICK</p>
        <p className="text-sm opacity-40">
          나를 위한 근사한 장소, 오늘은 더욱 특별하게.
        </p>
      </div>
      <Slider {...settings}>
        <ImageBox
          imageSrc={"src/assets/pickImages/cocktail.png"}
          divClass={"mr-2"}
        />
        <ImageBox
          imageSrc={"src/assets/pickImages/sushi.png"}
          divClass={"mr-2"}
        />
        <ImageBox
          imageSrc={"src/assets/pickImages/pasta.png"}
          divClass={"mr-2"}
        />
        <ImageBox
          imageSrc={"src/assets/pickImages/pizza.png"}
          divClass={"mr-2"}
        />
        <ImageBox
          imageSrc={"src/assets/pickImages/beef.png"}
          divClass={"mr-2"}
        />
        <ImageBox
          imageSrc={"src/assets/pickImages/rice.png"}
          divClass={"mr-2"}
        />
      </Slider>
    </div>
  );
}
