import React, { useState } from "react";
import Slider from "react-slick";

export default function RestaurantSlider({ mainImage, subImages }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };
  const images = [mainImage, ...subImages];
  return (
    <div className="relative cursor-pointer">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="w-full">
            <img
              src={image}
              className="h-[30vh] w-full object-cover sm:h-[50vh] sm:object-contain"
            />
          </div>
        ))}
      </Slider>
      <div className="absolute bottom-4 right-2 rounded-full bg-black p-2 text-xs text-white opacity-80">
        {currentSlide + 1} / {images.length} | 매장 사진
      </div>
    </div>
  );
}
