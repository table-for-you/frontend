import React, { useState } from "react";
import Slider from "react-slick";

export default function RestaurantSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    };

    return (
        <div className="relative cursor-pointer">
            <Slider {...settings}>
                <div>
                    <img
                        src="/src/assets/pickImages/beef.png"
                        className="w-full h-[30vh] object-cover xl:h-[50vh]" // 이미지 크기 및 비율 유지
                    />
                </div>
                <div>
                    <img
                        src="/src/assets/test.jpg"
                        className="w-full h-[30vh] object-cover xl:h-[50vh]" // 동일한 설정
                    />
                </div>
                <div>
                    <img
                        src="/src/assets/test.jpg"
                        className="w-full h-[30vh] object-cover xl:h-[50vh]"
                    />
                </div>
                <div>
                    <img
                        src="/src/assets/test.jpg"
                        className="w-full h-[30vh] object-cover xl:h-[50vh]"
                    />
                </div>
                <div>
                    <img
                        src="/src/assets/test.jpg"
                        className="w-full h-[30vh] object-cover xl:h-[50vh]"
                    />
                </div>
            </Slider>
            <div className="p-2 bg-black absolute text-white rounded-full text-xs bottom-4 right-2 opacity-80">
                {currentSlide + 1} / 5 | 매장 사진
            </div>
        </div>
    );
}
