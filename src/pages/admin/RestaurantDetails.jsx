import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useSelector } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import Button from "../../components/Button";
import { tomatoBtn } from "../../constants/style";
import Loading from "../../components/Loading";
import RestaurantSlider from "../../components/slide/RestaurantSlider";

export default function RestaurantDetails() {
  const { restaurantId } = useParams();
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const { accessToken } = useSelector((state) => state.authToken);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const foodTypeMap = {
    'KOREAN': '한식',
    'CHINESE': '중식',
    'JAPANESE': '일식',
    'WESTERN': '양식'
  }

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (accessToken) {
        const decoded = decodeToken(JSON.stringify(accessToken));
        if (decoded.role === "ADMIN") {
          const config = {
            headers: {
              Authorization: `${accessToken.token}`,
            },
          };
          
          try {
            const res = await api.get(
              `/admin/pending-restaurants/${restaurantId}`,
              config,
            );
            setRestaurantDetails(res.data);
          } catch (err) {
            console.error(err.response.data.message);
          } finally {
            setIsLoading(false);
          }
        } else {
          alert("권한이 없습니다.");
          navigate("/");
        }
      }
    };

    fetchRestaurantDetails();
  }, [accessToken, restaurantId, navigate]);

  const approveRestaurant = async () => {
    const config = {
      headers: {
        Authorization: `${accessToken.token}`,
      },
    };


    try {
      const res = await api.patch(
        `/admin/restaurants/${restaurantId}?status=APPROVED`,
        {},
        config,
      );
      alert(JSON.stringify(res.data.response));
      navigate("/admin/restaurant/manage");
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const rejectRestaurant = async () => {
    const config = {
      headers: {
        Authorization: `${accessToken.token}`,
      },
    };


    try {
      const res = await api.patch(
        `/admin/restaurants/${restaurantId}?status=REJECT`,
        {},
        config,
      );
      alert(JSON.stringify(res.data.response));
      navigate("/admin/restaurant/manage");
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      {isLoading ?
        <Loading /> :
        <div>
          <RestaurantSlider mainImage={restaurantDetails.mainImage} subImages={restaurantDetails.subImages} />
          <div className="flex flex-col gap-1">
            <span className="text-sm opacity-50">
              {foodTypeMap[restaurantDetails.foodType]}
            </span>
            <span className="text-lg font-bold">
              {restaurantDetails.name}
            </span>
            {/* <LikeCount likeCount={restaurantDetails.likeCount} /> */}
            {/* <Rating rating={restaurantDetails.rating} /> */}
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
            <div className="mb-2">
              {restaurantDetails.parking && (
                <span className="text-xs bg-neutral-200 opacity-50 px-1 py-0.5 rounded-lg">
                  주차 가능
                </span>
              )}
            </div>
            <div className="text-sm text-ellipsis ">
              <p>{restaurantDetails.description}</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-3">
            <Button
              onClick={approveRestaurant}
              className={`${tomatoBtn} px-4 py-2`}
            >
              승인하기
            </Button>
            <Button onClick={rejectRestaurant}>거절하기</Button>
          </div>
        </div>
      }
    </div>
  );
}
