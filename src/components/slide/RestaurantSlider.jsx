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
                            className="w-full h-[30vh] object-cover sm:h-[50vh] sm:object-contain"
                        />
                    </div>
                ))}

            </Slider>
            <div className="p-2 bg-black absolute text-white rounded-full text-xs bottom-4 right-2 opacity-80">
                {currentSlide + 1} / {images.length} | 매장 사진
            </div>
        </div>
    );
}
