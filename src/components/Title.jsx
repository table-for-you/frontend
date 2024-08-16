import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch } from "react-redux";
import { setInview } from "../store/inView";


export default function Title() {
    const dispatch = useDispatch();
    const { ref, inView } = useInView({
        threshold: 0.05
    });

    useEffect(() => {
        dispatch(setInview(inView));
    }, [inView, dispatch]);


    return (
        <div className=" relative h-[60vh]">
            <video
                src="src\assets\title.mp4"
                type="video/mp4"
                muted
                autoPlay
                loop
                playsInline
                className="h-full w-full object-cover"
                ref={ref}
            ></video>
            <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center w-full text-lg xl:text-xl"
            >
                <p>소중한 순간을 예약하세요.</p>
                <p>기억에 남을 장소가 여러분을 기다립니다.</p>
                <p>-Table For You-</p>
            </div>
        </div>
    );
}
