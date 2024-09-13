import { api } from "../../services/api";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { decodeToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { tomatoBtn } from "../../constants/style";

export default function RestaurantManage() {
  const [RestaurantList, setRestaurantList] = useState([]);

  const { accessToken } = useSelector((state) => state.authToken);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchRestaurantList = async () => {
      if (accessToken) {
        const decoded = decodeToken(JSON.stringify(accessToken));
        if (decoded.role === "ADMIN") {
          const config = {
            headers: {
              Authorization: `${accessToken.token}`, // accessToken을 헤더에 추가
            },
          };

          try {
            const res = await api.get(
              "/admin/pending-restaurants?pageable=1",
              config,
            );
            setRestaurantList(res.data.content);
          } catch (err) {
            console.error(err);
          }
        } else {
          alert("권한이 없습니다.");
          navigate("/");
        }
      } else {
        alert("권한이 없습니다.");
        navigate("/");
      }
    };

    fetchRestaurantList();
  }, [accessToken, navigate]);

  const handleViewDetails = (restaurantId) => {
    navigate(`/admin/restaurant/manage/detail/${restaurantId}`);
  };

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <div className="flex flex-col gap-5">
        <p className="text-lg">승인 요청 가게 목록</p>
        <div className="flex flex-col gap-4">
          {RestaurantList.length > 0 ? (
            RestaurantList.map((restaurant) => (
              <div
                key={restaurant.id}
                className="flex justify-between rounded-lg bg-neutral-100 p-5 shadow-lg"
              >
                <div>
                  <p>가게명 : {restaurant.name}</p>
                  <p>점주님 : {restaurant.ownerName}</p>
                </div>
                <Button
                  className={tomatoBtn}
                  style={"p-3 text-sm"}
                  onClick={() => handleViewDetails(restaurant.id)}
                >
                  자세히 보기
                </Button>
              </div>
            ))
          ) : (
            <div>
              <p>없는 표시 넣기, 로딩바도 준비</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
