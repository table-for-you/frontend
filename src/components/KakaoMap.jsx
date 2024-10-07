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
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchSelected, setSearchSelected] = useState('region');
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
    'KOREAN': '한식',
    'CHINESE': '중식',
    'JAPANESE': '일식',
    'WESTERN': '양식'
  };

  const regionMap = {
    "서울": "SEOUL",
    "제주도": "JEJU",
    "충남": "CHUNGNAM",
    "인천": "INCHEON",
    "대구": "DAEGU",
    "대전": "DAEJEON",
    "경기": "GYEONGGI",
    "경남": "GYEONGNAM",
    "부산": "BUSAN",
    "전북": "JEONBUK",
    "울산": "ULSAN",
    "광주": "GWANGJU",
    "강원": "GANGWON",
    "경북": "GYEONGBUK",
    "전남": "JEONNAM",
    "충북": "CHUNGBUK",
    "세종": "SEJONG",
  };


  const foodSearchMap = {
    '한식': 'KOREAN',
    '중식': 'CHINESE',
    '일식': 'JAPANESE',
    '양식': 'WESTERN'
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
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  }

  const createMarkers = (restaurantList) => {
    clearMarkers();

    const newMarkers = [];

    restaurantList.forEach((restaurant) => {
      const markerPosition = new kakao.maps.LatLng(restaurant.latitude, restaurant.longitude);
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
        getModalRestaurant(restaurant.name),
          setIsModalOpen(true);
      });

      newMarkers.push(marker); // 생성된 마커 배열에 추가
    });

    setMarkers(newMarkers); // 마커 배열 업데이트
  };


  const getRestaurant = async () => {
    try {
      const params = {
        type: "region",
        "search-keyword": "SEOUL"
      }

      const res = await api.get('/public/restaurants', { params });
      setRestaurantList(res.data.content);
      createMarkers(res.data.content);
      console.log(res.data.content);
    } catch (err) {
      console.error(err);
    }
  }



  const getModalRestaurant = async (name) => {
    try {
      const params = {
        type: "restaurant",
        "search-keyword": name
      }

      const res = await api.get('/public/restaurants', { params });
      setModalRestaurantInfo(res.data.content[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }


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
        "search-keyword": searchValue
      }

      const res = await api.get('/public/restaurants', { params });
      setRestaurantList(res.data.content);
      createMarkers(res.data.content);
    } catch (err) {
      console.error(err);
    }
  }

  const handleInputChange = (e) => {
    setSearchInputValue(e.target.value);
  }

  const handleSelectChange = (e) => {
    setSearchSelected(e.target.value);
  }

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
      <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-2 z-50 opacity-65">
        <div className="flex">
          <input type="text" value={searchInputValue} onChange={handleInputChange} />
          <select onChange={handleSelectChange}>
            <option value="region">지역</option>
            <option value="restaurant">식당명</option>
            <option value="location">주소</option>
            <option value="food">종류</option>
          </select>
          <span
            className="material-symbols-outlined bg-white cursor-pointer p-1"
            onClick={() => getSearchRestaurant(searchInputValue, searchSelected)}
          >
            search
          </span>
        </div>
      </div>
      <Modal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        parentClass={
          "absolute inset-0 z-50 bg-black bg-opacity-50"
        }
        childClass={
          "relative z-50 h-full w-[80%] bg-neutral-100 md:w-[30%] pt-12 bg-white shadow-md"
        }
        contentMotion={contentMotion}
      >
        {isLoading ?
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2">
            <BarLoader color="#ff0000" />
          </div>
          :
          <div>
            <img src={modalRestaurantInfo.mainImage} />
            <div className="flex flex-col sm:ml-5 text-lg gap-1.5 mt-2">
              <div className="flex items-center gap-1 font-bold">
                <span>{modalRestaurantInfo.name}</span>
                <span className="text-xs opacity-50">{foodTypeMap[modalRestaurantInfo.foodType]}</span>
              </div>
              <p className="text-xs">{modalRestaurantInfo.location}</p>
              <Rating rating={modalRestaurantInfo.rating} ratingNum={modalRestaurantInfo.ratingNum} />
              <span className="text-sm opacity-50">
                {modalRestaurantInfo.parking && (
                  <span className="text-xs bg-neutral-200 opacity-75 p-1 rounded-lg">
                    주차 가능
                  </span>
                )}
              </span>
            </div>
          </div>
        }
        <Button
          className={`${tomatoBtn} absolute bottom-3 right-5`}
          onClick={() => navigate(`/restaurant/location/details/${modalRestaurantInfo.id}`)}
        >
          예약하기
        </Button>
      </Modal>

    </div>
  );
}
