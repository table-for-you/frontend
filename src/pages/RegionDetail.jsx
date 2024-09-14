import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";


export default function RegionDetail() {
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  const { restaurantId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegionDetailRestaurant = async () => {
      try {
        const res = await api.get(`/public/restaurants/${restaurantId}`);
        setRestaurantDetails(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegionDetailRestaurant();
  }, [restaurantId]);

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      {isLoading ?
        <Loading /> :
        <div className="flex flex-col gap-3">
          <p className="bg-neutral-100 p-2 text-lg shadow-lg">
            가게명 : {restaurantDetails.name}
          </p>
          <div className="bg-neutral-100 p-2 shadow-lg">
            <p>장소 : {restaurantDetails.location}</p>
            <p>시간 : {restaurantDetails.time}</p>
            <p>메뉴 유형 : {restaurantDetails.foodType}</p>
            <p>가게 번호 : {restaurantDetails.tel}</p>
            <p>주차 유무 : {restaurantDetails.parking ? "O" : "X"}</p>
          </div>
          <div className="bg-neutral-100 p-2 shadow-lg">
            <p>
              가게 설명 <br />
              {restaurantDetails.description}
            </p>
          </div>
          {/* 총 좌석 등 json 내역 더 있음 */}
        </div>
      } 
    </div>
  );
}
