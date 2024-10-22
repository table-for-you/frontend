import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { api } from "../services/api";
import Button from "../components/Button";
import { decodeToken } from "../utils/decodeToken";

export default function DetailNotifications() {
  const { accessToken } = useSelector((state) => state.authToken);
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [token, setToken] = useState({});

  useEffect(() => {
    const fetchNotificationsDetail = async () => {
      if (accessToken) {
        const config = {
          headers: {
            Authorization: `${accessToken.token}`,
          },
        };

        try {
          const res = await api.get(
            `/users/notifications/${notificationId}`,
            config,
          );
          setNotifications(res.data);
          const getRestaurantName = await api.get(
            `/public/restaurants/${res.data.restaurantId}`,
          );
          setRestaurantName(getRestaurantName.data.name);
        } catch (err) {
          alert("알림 상태를 확인할 수 없습니다. (삭제된 가게 등)");
          navigate("/notifications");
        } finally {
          setIsLoading(false);
        }
      } else {
        alert("권한이 없습니다.");
        navigate("/");
      }
    };
    fetchNotificationsDetail();
  }, [accessToken, navigate]);

  useEffect(() => {
    if (accessToken) {
      const decoded = decodeToken(JSON.stringify(accessToken));
      if (decoded) {
        setToken(decoded);
      } else {
        console.log("Invalid token");
      }
    }
  }, [accessToken]);

  // USER, OWNER, ADMIN
  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {token.role === "USER" && (
            <div className="mb-2 rounded-lg bg-slate-200 p-5">
              <p>{notifications.content}</p>
              <p>{notifications.createdTime.split("T")[0]}</p>
            </div>
          )}

          {token.role === "OWNER" &&
            (notifications.status === "APPROVED" ? (
              <>
                <div className="mb-2 rounded-lg bg-green-100 p-5">
                  <p className="text-lg">가게명 : {restaurantName}</p>
                  <p>가게가 승인되었습니다!</p>
                  {notifications.createdTime.split("T")[0]}
                </div>
                <Button
                  style={"float-right text-sm"}
                  onClick={() => navigate("/owner/my-restaurant")}
                >
                  내 가게 목록 보기
                </Button>
              </>
            ) : notifications.status === "REJECT" ? (
              <>
                <div className="mb-2 rounded-lg bg-red-100 p-5">
                  <p className="text-lg">가게명 : {restaurantName}</p>
                  <p>가게 승인이 거절되었습니다. </p>
                  <p>
                    가게 등록시 필요한 내용을 확인해주시고
                    <br />
                    재신청 부탁드립니다.
                  </p>
                  {notifications.createdTime.split("T")[0]}
                </div>
                <Button
                  style={"float-right text-sm"}
                  onClick={() => navigate("/owner/reject-restaurant")}
                >
                  거절된 가게 목록 보기
                </Button>
              </>
            ) : (
              <div className="mb-2 rounded-lg bg-slate-200 p-5">
                <p>{notifications.content}</p>
                <p>{notifications.createdTime.split("T")[0]}</p>
              </div>
            ))}

          {token.role === "ADMIN" && (
            <div className="mb-2 rounded-lg bg-slate-200 p-5">
              <p>{notifications.content}</p>
              <p>{notifications.createdTime.split("T")[0]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
