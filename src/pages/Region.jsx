import { useNavigate, useParams } from "react-router-dom";
import Filter from "../components/Filter";
import SelectList from "../components/SelectList";
import { api } from "../services/api";
import { useState, useEffect } from "react";

export default function Region() {
  const [restaurantList, setRestaurantList] = useState([]);
  const { name } = useParams();


  useEffect(() => {
    const fetchRestaurantList = async () => {
      try {
        const params = {
          type: 'location',
          'search-keyword': name,
        }
        const res = await api.get('/public/restaurants', { params })
        setRestaurantList(res.data.content);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRestaurantList();
  }, [name])
  const navigate = useNavigate();

  const handleShowRestaurantDetail = (restaurantId) => {
    navigate(`/region/${name}/restaurant/${restaurantId}`);
  }

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <div className="flex gap-6">
        <Filter />
        <div className="flex flex-col w-full gap-3">
          <span className="p-2 text-xl font-bold ">{`'${name}' 식당 ${restaurantList.length}개`}</span>
          <div className="flex flex-col gap-6">
            {restaurantList.map((restaurant) => (
              <div
                className="flex flex-col shadow-lg px-6 py-10 gap-1 cursor-pointer"
                onClick={() => handleShowRestaurantDetail(restaurant.id)}
              >
                <span className="font-bold">{restaurant.name}</span>
                <div className="flex items-center gap-1">
                  <div className="relative bg-orange-300 inline-flex gap-1 justify-center font-bold px-1 rounded-lg">
                    <span className="material-symbols-outlined">
                      kid_star
                    </span>
                    <span>{restaurant.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {restaurant.ratingNum} 평가
                  </span>
                </div>
                <span>{restaurant.foodType}</span>
                <span className="text-sm">{restaurant.parking && "주차 가능해요"}</span>
              </div>
            ))}
          </div>
        </div>
        <SelectList />
      </div>
    </div>
  );
}

// 지도 맵 키 가려야함 ok, ux꾸미고 => 모든 컴포넌트 최적화(재사용, 파일 위치 등) 진행
