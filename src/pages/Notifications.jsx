import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Loading from "../components/Loading";
import Button from "../components/Button";
import { tomatoBtn } from "../constants/style";

export default function Notifications() {
  const { accessToken } = useSelector((state) => state.authToken);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyNotifications = async () => {
      if (accessToken) {
        const config = {
          headers: {
            Authorization: `${accessToken.token}`,
          },
        };

        try {
          const res = await api.get("/users/notifications", config);
          const sortedNotifications = res.data.sort(
            (a, b) => new Date(b.createdTime) - new Date(a.createdTime),
          );
          setNotifications(sortedNotifications);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        alert("권한이 없습니다.");
        navigate("/");
      }
    };
    fetchMyNotifications();
  }, [accessToken, navigate]);

  const readNotifications = notifications.filter(
    (notification) => notification.read,
  );
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  );

  const handleViewDetails = (notificationId) => {
    navigate(`/notifications/detail/${notificationId}`);
  };

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-5">
          <p className="text-lg">안 읽은 알림</p>
          <div className="h-[50vh] overflow-y-auto">
            {unreadNotifications
              .filter((notification) => notification.status !== "PENDING")
              .map((notification) => (
                <div
                  key={notification.id}
                  className="mb-2 flex flex-col justify-between gap-3 rounded-lg bg-neutral-100 p-5 shadow-lg sm:flex-row sm:items-center"
                >
                  <div>
                    <p>{notification.content}</p>
                    {notification.createdTime.split("T")[0]}
                  </div>
                  <Button
                    className={tomatoBtn}
                    style={"text-sm"}
                    onClick={() => handleViewDetails(notification.id)}
                  >
                    자세히 보기
                  </Button>
                </div>
              ))}
          </div>
          <p className="text-lg">읽은 알림</p>
          <div className="h-[50vh] overflow-y-auto">
            {readNotifications
              .filter((notification) => notification.status !== "PENDING")
              .map((notification) => (
                <div
                  key={notification.id}
                  className="mb-2 flex flex-col justify-between gap-3 rounded-lg bg-neutral-100 p-5 shadow-lg sm:flex-row sm:items-center"
                >
                  <div>
                    <p>{notification.content}</p>
                    {notification.createdTime.split("T")[0]}
                  </div>
                  <Button
                    className={tomatoBtn}
                    style={"text-sm"}
                    onClick={() => handleViewDetails(notification.id)}
                  >
                    자세히 보기
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
