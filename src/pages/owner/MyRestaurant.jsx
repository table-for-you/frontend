import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import { tomatoBtn } from "../../constants/style";

export default function MyRestaurant() {
  const { accessToken } = useSelector((state) => state.authToken);
  const [myRestaurant, setMyRestaurant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRestaurant = async () => {
      if (accessToken) {
        const decoded = decodeToken(JSON.stringify(accessToken));
        if (decoded.role === "OWNER") {
          const config = {
            headers: {
              Authorization: `${accessToken.token}`,
            },
          };

          try {
            const res = await api.get("/owner/restaurants", config);
            setMyRestaurant(res.data);
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        alert("권한이 없습니다.");
        navigate("/");
      }
    };
    fetchMyRestaurant();
  }, [accessToken, navigate]);

  const deleteRestaurant = async (restaurantId) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${accessToken.token}`,
      },
    };

    try {
      const res = await api.delete(`/owner/restaurants/${restaurantId}`, config);
      alert(JSON.stringify(res.data.response));
      setMyRestaurant((prevRestaurants) => (
        prevRestaurants.filter((restaurant) => restaurant.id !== restaurantId)
      ))
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <p className="mb-5 text-lg">나의 가게 목록</p>
      <div className="flex flex-col gap-7">
        {myRestaurant ? (
          myRestaurant.map((restaurant) => (
            <div
              key={restaurant.id}
              className="rounded-lg bg-neutral-100 p-6 shadow-md flex flex-col"
            >
              <p className="text-lg">{restaurant.name}</p>
              <div className="flex gap-1 mt-1 text-sm">
                <Button
                  className={tomatoBtn}
                  style={'p-2'}
                  onClick={() => navigate(`/owner/update-restaurant/${restaurant.id}`)}
                >
                  가게 업데이트
                </Button>
                <Button
                  className={tomatoBtn}
                  style={'p-2'}
                  onClick={() => navigate(`/owner/menu-manage/${restaurant.id}`)}
                >
                  메뉴 관리
                </Button>
                <Button onClick={() => deleteRestaurant(restaurant.id)}>
                  가게 삭제
                </Button>
              </div>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
