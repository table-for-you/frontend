import { useState, useEffect } from "react";

export const useSliderSettiongs = (defaultSlidesToShow = 4, sliderId) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideLength, setSlideLength] = useState(0);
  const [slideToShow, setSlideToShow] = useState(defaultSlidesToShow);

  useEffect(() => {
    setSlideLength(
      document.querySelectorAll(`${sliderId} .slick-slide`).length,
    );
    const handleSize = () => {
      if (matchMedia("(max-width: 1024px)").matches) {
        setSlideToShow(3);
      } else if (matchMedia("(min-width: 769px)").matches) {
        setSlideToShow(defaultSlidesToShow);
      }
    };

    handleSize();

    const mediaQueryLists = [
      matchMedia("(max-width: 1024px)"),
      matchMedia("(min-width: 769px)"),
    ];

    mediaQueryLists.forEach((mql) => {
      mql.addEventListener("change", handleSize);
    });

    return () => {
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener("change", handleSize);
      });
    };
  }, [defaultSlidesToShow, sliderId]);

  return {
    currentSlide,
    slideLength,
    slideToShow,
    setCurrentSlide,
  };
};
