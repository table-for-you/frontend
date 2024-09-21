import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

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

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <p className="mb-5 text-lg">나의 가게 목록</p>
      <div className="flex flex-col gap-7">
        {myRestaurant ? (
          myRestaurant.map((restaurant) => (
            <div
              key={restaurant.id}
              className="rounded-lg bg-neutral-100 p-6 shadow-md"
            >
              <p>{restaurant.name}</p>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}