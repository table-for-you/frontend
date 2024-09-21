import { useNavigate, useParams } from "react-router-dom";
import Filter from "../components/Filter";
import SelectList from "../components/SelectList";
import { api } from "../services/api";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Rating from "../components/Rating";

export default function Region() {
  const [restaurantList, setRestaurantList] = useState([]);
  const { name } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [foodType, setFoodType] = useState(null);


  const foodTypeMap = {
    'KOREAN': '한식',
    'CHINESE': '중식',
    'JAPANESE': '일식',
    'WESTERN': '양식'
  }

  useEffect(() => {
    const fetchRestaurantList = async () => {
      try {
        const params = {
          type: "location",
          "search-keyword": name,
        };
        const res = await api.get("/public/restaurants", { params });
        setRestaurantList(res.data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurantList();
  }, [name]);
  const navigate = useNavigate();

  const handleShowRestaurantDetail = (restaurantId) => {
    navigate(`/region/${name}/restaurant/${restaurantId}`);
  };


  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <Filter />
      <div className="flex gap-6 mt-2">
        {isLoading ?
          <Loading /> :
          <div className="flex w-full flex-col gap-3">
            <div className="flex justify-between">
              <span className="p-2 text-xl font-bold">{`'${name}' 식당 ${restaurantList.length}개`}</span>
              <SelectList />
            </div>
            {restaurantList.map((restaurant) => (
              <div
                className="flex cursor-pointer flex-col gap-1 px-6 py-8 shadow-lg sm:flex-row"
                onClick={() => handleShowRestaurantDetail(restaurant.id)}
              >
                <div className="w-[300px] h-[196px]">
                  <img src={restaurant.mainImage} className="rounded-lg" />
                </div>
                <div className="flex flex-col sm:ml-5 text-lg gap-1">
                  <div className="flex items-center gap-1 font-bold">
                    <span>{restaurant.name}</span>
                    <span className="text-xs opacity-50">{foodTypeMap[restaurant.foodType]}</span>
                  </div>
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
