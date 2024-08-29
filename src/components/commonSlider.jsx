import Slider from "react-slick";
import { useSliderSettiongs } from "../hooks/useSliderSettings";
import { useState } from "react";

const PrevArrow = ({ currentSlide, onClick }) => {
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

const NextArrow = ({ currentSlide, slideLength, slideToShow, onClick }) => {
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

export default function CommonSlider({
  items,
  sliderId,
  defaultSlidesToShow = 4,
  defaultSlidesToScroll = 1,
}) {
  const { currentSlide, slideLength, slideToShow, setCurrentSlide } =
    useSliderSettiongs(defaultSlidesToShow, sliderId);
  const [dragging, setDragging] = useState(false);

  const beforeChange = (oldIndex, newIndex) => {
    setCurrentSlide(newIndex);
    setDragging(true);
  };

  const afterChange = () => {
    setDragging(false);
  };

  const handleClickCapture = (e) => {
    if (dragging) {
      e.stopPropagation();
      setDragging(false);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: slideToShow,
    slidesToScroll: defaultSlidesToScroll,
    nextArrow: (
      <NextArrow
        currentSlide={currentSlide}
        slideLength={slideLength}
        slideToShow={slideToShow}
      />
    ),
    prevArrow: <PrevArrow currentSlide={currentSlide} />,
    beforeChange: beforeChange,
    afterChange: afterChange,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: defaultSlidesToShow,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {items.map((item, index) => (
        <div key={index} onClickCapture={handleClickCapture}>
          {item}
        </div>
      ))}
    </Slider>
  );
}
