import { api } from "../../services/api";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { decodeToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { tomatoBtn } from "../../constants/style";
import Loading from "../../components/Loading";

export default function RestaurantManage() {
  const [RestaurantList, setRestaurantList] = useState([]);
  const [ApprovedRestaurantList, setApprovedRestaurantList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState('');

  const { accessToken } = useSelector((state) => state.authToken);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setSearchInputValue(e.target.value);
  }

  const getApprovedRestaurant = async () => {
    if (accessToken) {
      const decoded = decodeToken(JSON.stringify(accessToken));
      if (decoded.role === "ADMIN") {
        const config = {
          headers: {
            Authorization: `${accessToken.token}`, // accessToken을 헤더에 추가
          },

        };

        try {
          const res = await api.get(`/admin/approved-restaurants?pageable=1`, config);
          setApprovedRestaurantList(res.data.content);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  const searchApprovedRestaurant = async () => {
    if (accessToken) {
      const decoded = decodeToken(JSON.stringify(accessToken));
      if (decoded.role === "ADMIN") {
        const params = {
          type: "restaurant",
          'search-keyword': searchInputValue
        }

        const config = {
          headers: {
            Authorization: `${accessToken.token}`, // accessToken을 헤더에 추가
          },

          params: params
        };

        try {
          if (searchInputValue !== '') {
            const res = await api.get(`/admin/approved-restaurants?pageable=1`, config);
            setApprovedRestaurantList(res.data.content);
          } else {
            getApprovedRestaurant();
          }

        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  const deleteApprovedRestaurant = async (restaurantId) => {
    if (accessToken) {
      const decoded = decodeToken(JSON.stringify(accessToken));
      if (decoded.role === "ADMIN") {

        const config = {
          headers: {
            Authorization: `${accessToken.token}`, // accessToken을 헤더에 추가
          },
        };

        try {
          const res = api.delete(`/admin/restaurants/${restaurantId}`, config);
          alert("정상적으로 식당을 삭제하였습니다.")
          getApprovedRestaurant();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

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
          } finally {
            setIsLoading(false);
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
    getApprovedRestaurant();
  }, [accessToken, navigate]);


  const handleViewDetails = (restaurantId) => {
    navigate(`/admin/restaurant/manage/detail/${restaurantId}`);
  };

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <div className="flex flex-col gap-5">
        <p className="text-lg">승인 요청 가게 목록</p>
        <div className="flex flex-col gap-4">
          {isLoading ?
            <Loading /> :
            RestaurantList.length > 0 ? (
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
              <div className="flex justify-center items-center h-[60vh] text-xl">
                <p>승인 요청 가게가 없습니다.</p>
              </div>
            )
          }
        </div>

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-lg">등록된 점주 식당 목록</p>
          <div className="flex items-center space-x-2 p-3 bg-white shadow-md rounded-lg text-sm">
            <input
              type="text"
              value={searchInputValue}
              onChange={handleInputChange}
              placeholder="식당 검색"
              className="border border-gray-300 rounded-md px-1 py-1  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchApprovedRestaurant();
                }
              }}
            />
            <span
              className="material-symbols-outlined bg-red-500 text-white cursor-pointer p-0.5 rounded-md hover:bg-red-600 transition duration-200"
              onClick={searchApprovedRestaurant}
            >
              search
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isLoading ?
            <Loading /> :
            ApprovedRestaurantList.length > 0 ? (
              ApprovedRestaurantList.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex justify-between rounded-lg bg-neutral-100 p-5 shadow-lg"
                >
                  <div>
                    <p>가게명 : {restaurant.name}</p>
                    <p>점주님 : {restaurant.ownerName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      style={"p-3 text-sm"}
                      onClick={() => handleViewDetails(restaurant.id)}
                    >
                      자세히 보기
                    </Button>
                    <Button
                      className={tomatoBtn}
                      style={"p-3 text-sm"}
                      onClick={() => {
                        if (confirm('정말로 식당을 삭제하시겠습니까?')) {
                          deleteApprovedRestaurant(restaurant.id);
                        }
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-[60vh] text-xl">
                <p>등록된 가게가 없습니다.</p>
              </div>
            )
          }
        </div>

      </div>
    </div>
  );
}
