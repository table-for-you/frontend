import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useSelector } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import Button from "../../components/Button";
import { tomatoBtn } from "../../constants/style";

export default function RestaurantDetails() {
  const { restaurantId } = useParams();
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const { accessToken } = useSelector((state) => state.authToken);

  const navigate = useNavigate();

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
        `/admin/restaurants/${restaurantId}`,
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
      const res = await api.delete(
        `/admin/restaurants/${restaurantId}`,
        config,
      );
      alert(JSON.stringify(res.data.response));
      navigate("/admin/restaurant/manage");
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  if (!restaurantDetails) {
    return <p>추후 로딩 스피너 넣기</p>;
  }

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
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

        <div className="flex justify-end gap-3">
          <Button
            onClick={approveRestaurant}
            className={`${tomatoBtn} px-4 py-2`}
          >
            승인하기
          </Button>
          <Button onClick={rejectRestaurant}>거절하기</Button>
        </div>
      </div>
    </div>
  );
}
