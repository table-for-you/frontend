import { useLocation, useNavigate, useParams } from "react-router-dom";
import Filter from "../components/Filter";
import SelectList from "../components/SelectList";
import { api } from "../services/api";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Rating from "../components/Rating";

export default function Restaurant() {
  const [restaurantList, setRestaurantList] = useState([]);
  const { name } = useParams();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [myMenu, setMyMenu] = useState([]);
  const [sortOpt, setSortOpt] = useState('rating');
  const [filteredRestaurantList, setFilteredRestaurantList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);


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

  const foodTypeMap = {
    '한식': 'KOREAN',
    '중식': 'CHINESE',
    '일식': 'JAPANESE',
    '양식': 'WESTERN'
  };

  const covertFoodType = {
    'KOREAN': '한식',
    'CHINESE': '중식',
    'JAPANESE': '일식',
    'WESTERN': '양식'
  }

  useEffect(() => {
    const fetchRestaurantList = async () => {
      try {

        let searchName = name;

        if (state?.searchType === "region" && regionMap[searchName]) {
          searchName = regionMap[searchName];
        }

        if (state?.searchType === "food" && foodTypeMap[searchName]) {
          searchName = foodTypeMap[searchName];
        }


        const params = {
          type: state?.searchType || "location",
          "search-keyword": searchName,
          'sort-by': sortOpt
        };
        const res = await api.get("/public/restaurants", { params });
        setRestaurantList(res.data.content);
        setFilteredRestaurantList(res.data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurantList();
  }, [name, sortOpt]);

  useEffect(() => {
    const applyFilters = () => {
      let filteredList = [...restaurantList];

      if (selectedFilters.includes('주차 가능')) {
        filteredList = filteredList.filter((restaurant) => restaurant.parking === true);
      }

      const foodFilters = selectedFilters.filter(filter => ['한식', '중식', '일식', '양식'].includes(filter));

      if (foodFilters.length > 0) {
        filteredList = filteredList.filter((restaurant) => foodFilters.includes(covertFoodType[restaurant.foodType]));
      }

      setFilteredRestaurantList(filteredList);
    }

    applyFilters();
  }, [selectedFilters, restaurantList]);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const navigate = useNavigate();

  const handleShowRestaurantDetail = (restaurantId) => {
    navigate(`/restaurant/${name}/details/${restaurantId}`);
  };

  const handleSortChange = (e) => {
    setSortOpt(e.target.value);
  }

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <Filter onFilterChange={handleFilterChange} />
      <div className="flex gap-6 mt-2">
        {isLoading ?
          <Loading /> :
          <div className="flex w-full flex-col gap-3">
            <div className="flex justify-between">
              <span className="p-2 text-xl font-bold">{`'${name}' 식당 ${restaurantList.length}개`}</span>
              <SelectList handleSortChange={handleSortChange} />
            </div>
            {filteredRestaurantList.map((restaurant) => (
              <div
                className="flex cursor-pointer flex-col gap-1 px-6 py-8 shadow-lg sm:flex-row"
                onClick={() => handleShowRestaurantDetail(restaurant.id)}
                key={restaurant.id}
              >
                <div className="w-[300px] h-[196px]">
                  <img src={restaurant.mainImage} className="rounded-lg" />
                </div>
                <div className="flex flex-col sm:ml-5 text-lg gap-1">
                  <div className="flex items-center gap-1 font-bold">
                    <span>{restaurant.name}</span>
                    <span className="text-xs opacity-50">{covertFoodType[restaurant.foodType]}</span>
                  </div>
                  <p className="text-xs">{restaurant.location}</p>
                  <Rating rating={restaurant.rating} ratingNum={restaurant.ratingNum} />
                  <span className="text-sm opacity-50">
                    {restaurant.parking && (
                      <span className="text-xs bg-neutral-200 opacity-75 p-1 rounded-lg">
                        주차 가능
                      </span>
                    )}
                  </span>

                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
// 지도 맵 키 가려야함 ok, ux꾸미고 => 모든 컴포넌트 최적화(재사용, 파일 위치 등) 진행
