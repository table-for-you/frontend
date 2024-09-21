import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../../utils/decodeToken";
import { api } from "../../services/api";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import { tomatoBtn } from "../../constants/style";

export default function Notifications() {
    const { accessToken } = useSelector((state) => state.authToken);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyNotifications = async () => {
            if (accessToken) {
                const decoded = decodeToken(JSON.stringify(accessToken));
                if (decoded.role === "OWNER") {
                    const config = {
                        headers: {
                            Authorization: `${accessToken.token}`,
                        },
                    };

                    try {
                        const res = await api.get("/users/notifications", config);
                        setNotifications(res.data.content);
                        console.log(res.data.content);
                    } catch (err) {
                        console.error(err);
                    } finally {
                        setIsLoading(false);
                    }
                }
            } else {
                alert("권한이 없습니다.");
                navigate("/");
            }
        };
        fetchMyNotifications();
    }, [accessToken, navigate]);

    const readNotifications = notifications.filter((notification) => notification.read);
    const unreadNotifications = notifications.filter((notification) => !notification.read);

    const handleViewDetails = (notificationId) => {
        navigate(`/owner/notifications/detail/${notificationId}`);
    };

    return (
        <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
            {isLoading ?
                <Loading /> :
                <div className="flex flex-col gap-5">
                    <div>
                        <p className="text-lg mb-5">안 읽은 알림</p>
                        {unreadNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="flex justify-between rounded-lg bg-neutral-100 p-5 shadow-lg mb-2 items-center"
                            >
                                {notification.status === 'PENDING' ?
                                    <p>가게 승인 보류중입니다.</p> :
                                    <p>{notification.content}</p>
                                }
                                <Button
                                    className={tomatoBtn}
                                    style={"p-3 text-sm"}
                                    onClick={() => handleViewDetails(notification.id)}
                                >
                                    자세히 보기
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="text-lg mb-5">읽은 알림</p>
                        {readNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="flex justify-between rounded-lg bg-neutral-100 p-5 shadow-lg mb-2 items-center"
                            >
                                {notification.status === 'PENDING' ?
                                    <p>가게 승인 보류중입니다.</p> :
                                    <p>{notification.content}</p>
                                }
                                <Button
                                    className={tomatoBtn}
                                    style={"p-3 text-sm"}
                                    onClick={() => handleViewDetails(notification.id)}
                                >
                                    자세히 보기
                                </Button>
                            </div>
                        ))}
                    </div>


                </div>

            }
        </div>
    )
}