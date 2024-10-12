import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch } from "react-redux";
import { setInview } from "../store/inView";
import { Link } from "react-scroll";
import { tomatoBtn, inputStyle } from "../constants/style";
import Modal from "./Modal";
import Button from "./Button";

import SearchRestaurant from "./search/SearchRestaurant";
import SearchType from "./search/SearchType";
import SearchUserCount from "./search/SearchUserCount";
import { useShowMobile } from "../hooks/useShowMobile";
import { useNavigate } from "react-router-dom";


export default function Title() {
  const dispatch = useDispatch();
  const { ref, inView } = useInView({
    // 동적 헤더
    threshold: 0.05,
  });
  const { showMobile, isModalOpen, setIsModalOpen } = useShowMobile();
  const [searchType, setSearchType] = useState("location");
  const [searchInputValue, setSearchInputValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setInview(inView));
  }, [inView, dispatch]);

  useEffect(() => {
    // 모바일 전체 모달 적용 위한 이펙트
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  const mobileSearchModalMotion = {
    initial: { opacity: 0, y: 200 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 200 },
    transition: {
      type: "spring",
      stiffness: 2000,
      damping: 250,
      duration: 0.5,
    },
  };

  const handleTypeChange = (e) => {
    setSearchType(e.target.value);
  }

  const search = (type, searchInputValue) => {
    navigate(`/restaurant/${searchInputValue}/`, { state: { searchType: type } })
  }

  return (
    <div className="relative h-[100vh]">
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

      <div className="absolute left-1/2 top-1/3 flex w-full -translate-x-1/2 -translate-y-1/2 transform justify-center text-lg text-white xl:text-xl">
        {showMobile ? (
          <div className="relative">
            <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 transform p-2 text-black opacity-45">
              restaurant
            </span>
            <input
              type="text"
              className={`${inputStyle} cursor-pointer pl-9 text-[1rem] text-black shadow-2xl`}
              placeholder="빠르게 식당을 검색해 보세요."
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-lg bg-white px-10 py-4 text-black shadow-2xl">
            <p className="font-semibold">빠르게 식당 검색</p>
            <div className="flex justify-center gap-3">
              <SearchRestaurant
                searchInputValue={searchInputValue}
                setSearchInputValue={setSearchInputValue}
                onSearch={() => search(searchType, searchInputValue)} 
              />
              {/* <SearchCalendar /> */}
              <SearchType handleTypeChange={(e) => handleTypeChange(e)} />
              <SearchUserCount />
              <Button
                style={`w-20 text-sm`}
                onClick={() => search(searchType, searchInputValue)}
              >
                검색
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-32 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform text-center text-lg text-white xl:text-xl">
        <p>소중한 순간을 예약하세요.</p>
        <p>기억에 남을 장소가 여러분을 기다립니다.</p>
        <p>-Table For You-</p>
      </div>

      <Link
        to="black-pick"
        smooth={true}
        duration={1000}
        offset={-85}
        className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 transform cursor-pointer items-center justify-center p-2"
      >
        <span className="animate-ripple absolute h-8 w-8 rounded-full border border-white"></span>
        <span className="material-symbols-outlined text-white">
          keyboard_double_arrow_down
        </span>
      </Link>

      <Modal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        parentClass={
          "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        }
        childClass={"z-50 h-full w-full bg-neutral-100"}
        contentMotion={mobileSearchModalMotion}
      >
        <div className="flex flex-col gap-5 p-5">
          <div className="mt-4 flex flex-col gap-2 rounded-lg bg-white p-8 shadow-lg">
            <p className="text-xl font-bold">어디로 예약할까요?</p>
            <SearchRestaurant
              searchInputValue={searchInputValue}
              setSearchInputValue={setSearchInputValue}
            />
          </div>

          <div className="mt-4 rounded-lg bg-white p-8 shadow-lg">
            {/* <SearchCalendar /> */}
            <SearchType handleTypeChange={(e) => handleTypeChange(e)} />
          </div>

          <div className="mt-4 rounded-lg bg-white p-8 shadow-lg">
            <SearchUserCount />
          </div>
          <Button
            style={`${tomatoBtn}`}
            onClick={() => search(searchType, searchInputValue)}
          >검색</Button>
        </div>
      </Modal>
    </div>
  );
}
