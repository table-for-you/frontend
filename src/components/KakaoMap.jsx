import { useEffect, useState } from "react";
import { api } from "../services/api";
import Modal from "./Modal";
import Rating from "./Rating";
const { kakao } = window;
import { BarLoader } from "react-spinners";
import Button from "./Button";
import { tomatoBtn } from "../constants/style";
import { useNavigate } from "react-router-dom";

export default function KakaoMap({ size }) {
  const [map, setMap] = useState(null);
  const [level, setLevel] = useState(9);
  const [restaurantList, setRestaurantList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRestaurantInfo, setModalRestaurantInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchSelected, setSearchSelected] = useState("location");
  const [markers, setMarkers] = useState([]); // 마커 리스트 저장

  const navigate = useNavigate();

  const contentMotion = {
    initial: { opacity: 0, x: -200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 },
    transition: {
      type: "spring",
      stiffness: 2000,
      damping: 250,
      duration: 0.5,
    },
  };

  const foodTypeMap = {
    KOREAN: "한식",
    CHINESE: "중식",
    JAPANESE: "일식",
    WESTERN: "양식",
  };

  const regionMap = {
    서울: "SEOUL",
    제주: "JEJU",
    충남: "CHUNGNAM",
    인천: "INCHEON",
    대구: "DAEGU",
    대전: "DAEJEON",
    경기: "GYEONGGI",
    경남: "GYEONGNAM",
    부산: "BUSAN",
    전북: "JEONBUK",
    울산: "ULSAN",
    광주: "GWANGJU",
    강원: "GANGWON",
    경북: "GYEONGBUK",
    전남: "JEONNAM",
    충북: "CHUNGBUK",
    세종: "SEJONG",
  };

  const foodSearchMap = {
    한식: "KOREAN",
    중식: "CHINESE",
    일식: "JAPANESE",
    양식: "WESTERN",
  };

  useEffect(() => {
    const container = document.getElementById("map"); // 지도 담을 영역 DOM 래퍼런스
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(37.5642135, 127.0016985), // 지도 중심 좌표 (초기 서울)
      level: 9, //지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container, options);
    setMap(map);

    setLevel(map.getLevel());
  }, []);

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const createMarkers = (restaurantList) => {
    clearMarkers();

    const newMarkers = [];

    restaurantList.forEach((restaurant) => {
      const markerPosition = new kakao.maps.LatLng(
        restaurant.latitude,
        restaurant.longitude,
      );
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);
      const iwContent = `<div style="padding:4px; font-size:0.8rem; cursor:pointer;">
      ${restaurant.name}
      </div>`;
      const iwRemoveable = true;

      const infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });

      kakao.maps.event.addListener(marker, "mouseover", () => {
        infowindow.open(map, marker);
      });

      kakao.maps.event.addListener(marker, "mouseout", () => {
        infowindow.close(map, marker);
      });

      kakao.maps.event.addListener(marker, "click", () => {
        getModalRestaurant(restaurant.id), setIsModalOpen(true);
      });

      newMarkers.push(marker); // 생성된 마커 배열에 추가
    });

    setMarkers(newMarkers); // 마커 배열 업데이트
  };

  const getRestaurant = async () => {
    try {
      const params = {
        type: "region",
        "search-keyword": "SEOUL",
      };

      const res = await api.get("/public/restaurants", { params });
      setRestaurantList(res.data.content);
      createMarkers(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  const getModalRestaurant = async (restaurantId) => {
    try {
      const res = await api.get(`/public/restaurants/${restaurantId}`);
      setModalRestaurantInfo(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSearchRestaurant = async (inputValue, selected) => {
    let searchValue = inputValue;

    if (selected === "region" && regionMap[searchValue]) {
      searchValue = regionMap[searchValue];
    }

    if (selected === "food" && foodSearchMap[searchValue]) {
      searchValue = foodSearchMap[searchValue];
    }

    try {
      const params = {
        type: selected,
        "search-keyword": searchValue,
      };

      const res = await api.get("/public/restaurants", { params });
      setRestaurantList(res.data.content);
      createMarkers(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSearchSelected(e.target.value);
  };

  useEffect(() => {
    getRestaurant(); // 페이지 최초 로드 시 getRestaurant 호출
  }, [map]);

  const zoomIn = () => {
    if (map) {
      const currentLevel = map.getLevel();
      map.setLevel(currentLevel - 1);
      setLevel(currentLevel - 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      const currentLevel = map.getLevel();
      map.setLevel(currentLevel + 1);
      setLevel(currentLevel + 1);
    }
  };

  return (
    <div className="relative">
      <div id="map" className={`${size}`}></div>
      <span
        className="material-symbols-outlined absolute bottom-3 right-11 z-50 cursor-pointer rounded-full bg-black text-white opacity-30"
        onClick={zoomOut}
      >
        remove
      </span>
      <span
        className="material-symbols-outlined absolute bottom-3 right-3 z-50 cursor-pointer rounded-full bg-black text-white opacity-30"
        onClick={zoomIn}
      >
        add
      </span>
      <div className="absolute left-1/2 top-4 z-50 -translate-x-1/2 -translate-y-2 opacity-80">
        <div className="flex items-center space-x-2 rounded-lg bg-white p-3 text-sm shadow-md">
          <input
            type="text"
            value={searchInputValue}
            onChange={handleInputChange}
            placeholder="서울"
            className="rounded-md border border-gray-300 px-1 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getSearchRestaurant(searchInputValue, searchSelected);
              }
            }}
          />
          <select
            onChange={handleSelectChange}
            className="rounded-md border border-gray-300 px-1 py-1 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="location">주소</option>
            <option value="region">지역</option>
            <option value="restaurant">식당명</option>
            <option value="food">종류</option>
          </select>
          <span
            className="material-symbols-outlined cursor-pointer rounded-md bg-blue-500 p-0.5 text-white transition duration-200 hover:bg-blue-600"
            onClick={() =>
              getSearchRestaurant(searchInputValue, searchSelected)
            }
          >
            search
          </span>
        </div>
      </div>
      <Modal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        parentClass={"absolute inset-0 z-50 bg-black bg-opacity-50"}
        childClass={
          "relative z-50 h-full w-[80%] bg-neutral-100 md:w-[30%] pt-12 bg-white shadow-md"
        }
        contentMotion={contentMotion}
      >
        {isLoading ? (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2">
            <BarLoader color="#ff0000" />
          </div>
        ) : (
          <div>
            <img src={modalRestaurantInfo.mainImage} />
            <div className="mt-2 flex flex-col gap-1.5 text-lg sm:ml-5">
              <div className="flex items-center gap-1 font-bold">
                <span>{modalRestaurantInfo.name}</span>
                <span className="text-xs opacity-50">
                  {foodTypeMap[modalRestaurantInfo.foodType]}
                </span>
              </div>
              <p className="text-xs">{modalRestaurantInfo.location}</p>
              <Rating
                rating={modalRestaurantInfo.rating}
                ratingNum={modalRestaurantInfo.ratingNum}
              />
              <span className="text-sm opacity-50">
                {modalRestaurantInfo.parking && (
                  <span className="rounded-lg bg-neutral-200 p-1 text-xs opacity-75">
                    주차 가능
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
        <Button
          className={`${tomatoBtn} absolute bottom-3 right-5`}
          onClick={() =>
            navigate(`/restaurant/location/details/${modalRestaurantInfo.id}`)
          }
        >
          예약하기
        </Button>
      </Modal>
    </div>
  );
}
