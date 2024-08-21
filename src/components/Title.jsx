import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch } from "react-redux";
import { setInview } from "../store/inView";
import { Link } from "react-scroll";
import { inputStyle, tomatoBtn, btn } from "../constants/style";
import Modal from "./Modal";
import Button from "./Button";
import Calendar from "./Calendar";
import SearchRank from "./SearchRank";

export default function Title() {
  const dispatch = useDispatch();
  const { ref, inView } = useInView({
    // 동적 헤더
    threshold: 0.05,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCount, setUserCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRank, setShowRank] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [rankInputValue, setRankInputValue] = useState('');
  const [showMobile, setShowMobile] = useState(false);

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

  useEffect(() => {
    const handleSize = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setShowMobile(true);
      } else if (window.matchMedia("(min-width: 769px)").matches) {
        setShowMobile(false);
      }
    };

    handleSize();

    const mediaQueryLists = [
      window.matchMedia("(max-width: 768px)"),
      window.matchMedia("(min-width: 1024px)"),
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

  const handleIncreaseCount = () => {
    setUserCount((prevCount) => prevCount + 1);
  };

  const handleDecreaseCount = () => {
    setUserCount((prevCount) => prevCount - 1);
  };

  const onDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setShowCalendar(false);
  };

  const handleSelectRegion = (region) => {
    setRankInputValue(region);
    setShowRank(false);
  }

  const handleRegionChange = (e) => {
    setRankInputValue(e.target.value);
  }

  const contentMotion = {
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

      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 transform text-lg text-white xl:text-xl">
        {
          showMobile ?
            <div className="relative">
              <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 transform p-2 text-black opacity-45">
                restaurant
              </span>
              <input
                type="text"
                className={`${inputStyle} cursor-pointer pl-9 text-[1rem] text-black`}
                placeholder="빠르게 식당을 검색해 보세요."
                onClick={() => setIsModalOpen(true)}
              />
            </div> :
            <div className="bg-white flex flex-col text-black px-10 py-4 rounded-lg shadow-2xl gap-2">
              <p className="font-semibold">빠르게 식당 검색</p>
              <div className="flex gap-2">
                <div className="relative">
                  <span className="material-symbols-outlined opacity-45 absolute top-2.5 left-2">
                    restaurant
                  </span>
                  <input
                    type="text"
                    className={`${inputStyle} pl-8 text-[1rem] cursor-pointer active:bg-white`}
                    placeholder="원하시는 식당을 검색해 주세요."
                    value={rankInputValue}
                    onClick={() => setShowRank(!showRank)}
                    onChange={handleRegionChange}
                  />
                  <div className="text-sm absolute bg-white w-full p-2 rounded-lg">
                    {showRank && <SearchRank onSelectRegion={handleSelectRegion} />}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    className={`${inputStyle} text-[1rem] cursor-pointer active:bg-white`}
                    onClick={() => setShowCalendar(!showCalendar)}
                    placeholder="날짜를 선택해 주세요."
                    value={selectedDate}
                    readOnly
                  />
                  <div className="text-xs absolute bg-white p-2 w-[62.8%] max-h-[300px] overflow-y-auto rounded-lg">
                    {showCalendar && <Calendar onDateClick={onDateClick} />}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={`인원 ${userCount}`}
                    className={`${inputStyle} text-[1rem] cursor-pointer active:bg-white`}
                    onClick={() => setShowUser(!showUser)}
                    readOnly
                  />

                  {showUser && (
                    <div className="text-sm absolute bg-white  p-2 rounded-lg">
                      <span>인원</span>
                      <div className="flex">
                        <p className="text-xs font-bold opacity-35">
                          유아 및 아동도
                          <br />
                          인원수에 포함해주세요.
                        </p>
                        <div className="flex items-center gap-2">
                          {userCount <= 1 ? (
                            <span className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 opacity-50">
                              remove
                            </span>
                          ) : (
                            <span
                              className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 hover:bg-gray-100 active:bg-gray-200"
                              onClick={handleDecreaseCount}
                            >
                              remove
                            </span>
                          )}
                          <span className="p-1 text-xl font-bold">{userCount}</span>
                          {userCount >= 99 ? (
                            <span className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 opacity-50">
                              add
                            </span>
                          ) : (
                            <span
                              className="material-symbols-outlined ounded-full cursor-pointer rounded-full border-2 p-1 hover:bg-gray-100 active:bg-gray-200"
                              onClick={handleIncreaseCount}
                            >
                              add
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        }

      </div>

      <div className="absolute left-1/2 bottom-32 w-full -translate-x-1/2 -translate-y-1/2 transform text-center text-lg text-white xl:text-xl ">
        <p>소중한 순간을 예약하세요.</p>
        <p>기억에 남을 장소가 여러분을 기다립니다.</p>
        <p>-Table For You-</p>
      </div>

      <Link
        to="black-pick"
        smooth={true}
        duration={1000}
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
        className={"z-50 h-full w-full bg-neutral-100"}
        contentMotion={contentMotion}
      >
        <div className="flex flex-col gap-5 p-5">
          <div className="mt-4 flex flex-col gap-2 rounded-lg bg-white p-8 shadow-lg">
            <p className="text-xl font-bold">어디로 예약할까요?</p>
            <div className="relative">
              <span className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 transform p-2 text-black opacity-45">
                search
              </span>
              <input
                type="text"
                value={rankInputValue}
                className={`${inputStyle} cursor-pointer pl-9 text-[1rem] text-black`}
                placeholder="원하시는 식당을 검색해 보세요."
                onClick={() => setShowRank(!showRank)}
                onChange={handleRegionChange}
              />
            </div>
            {showRank && <SearchRank onSelectRegion={handleSelectRegion} />}
          </div>

          <div className="mt-4 rounded-lg bg-white p-8 shadow-lg">
            <input
              type="text"
              className={`${inputStyle} w-full`}
              onClick={() => setShowCalendar(!showCalendar)}
              placeholder="날짜를 선택해 주세요."
              value={selectedDate}
              readOnly
            />
            {showCalendar && <Calendar onDateClick={onDateClick} />}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-white p-8 shadow-lg">
            <div>
              <span>인원</span>
              <p className="text-xs font-bold opacity-35">
                유아 및 아동도
                <br />
                인원수에 포함해주세요.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {userCount <= 1 ? (
                <span className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 opacity-50">
                  remove
                </span>
              ) : (
                <span
                  className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 hover:bg-gray-100 active:bg-gray-200"
                  onClick={handleDecreaseCount}
                >
                  remove
                </span>
              )}
              <span className="p-1 text-xl font-bold">{userCount}</span>
              {userCount >= 99 ? (
                <span className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 opacity-50">
                  add
                </span>
              ) : (
                <span
                  className="material-symbols-outlined ounded-full cursor-pointer rounded-full border-2 p-1 hover:bg-gray-100 active:bg-gray-200"
                  onClick={handleIncreaseCount}
                >
                  add
                </span>
              )}
            </div>
          </div>
          <Button style={`${tomatoBtn}`}>검색</Button>
        </div>
      </Modal>
    </div>
  );
}
