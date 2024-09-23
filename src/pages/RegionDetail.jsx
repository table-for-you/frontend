import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import RestaurantSlider from "../components/slide/RestaurantSlider";
import Rating from "../components/Rating";
import LikeCount from "../components/LikeCount";

export default function RegionDetail() {
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  const { restaurantId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const foodTypeMap = {
    'KOREAN': '한식',
    'CHINESE': '중식',
    'JAPANESE': '일식',
    'WESTERN': '양식'
  }

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
        <>
          <div className="border-b">
            <RestaurantSlider mainImage={restaurantDetails.mainImage} subImages={restaurantDetails.subImages} />
            <div className="flex flex-col gap-1">
              <span className="text-sm opacity-50">
                {foodTypeMap[restaurantDetails.foodType]}
              </span>
              <span className="text-lg font-bold">
                {restaurantDetails.name}
              </span>
              <LikeCount likeCount={restaurantDetails.likeCount} />
              <Rating rating={restaurantDetails.rating} />
              <div className="mt-2 flex flex-col text-sm gap-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined">
                    map
                  </span>
                  <span>
                    {restaurantDetails.location}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined">
                    schedule
                  </span>
                  <span>
                    {restaurantDetails.time}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined">
                    call
                  </span>
                  <span>
                    {restaurantDetails.tel}
                  </span>
                </div>
              </div>
              <div className="text-sm text-ellipsis ">
                <p>{restaurantDetails.description}</p>
              </div>
              <div className="mb-2">
                {restaurantDetails.parking && (
                  <span className="text-xs bg-neutral-200 opacity-50 px-1 py-0.5 rounded-lg">
                    주차 가능
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      }
    </div>
  );
}
