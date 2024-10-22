import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Restaurant from "./pages/Restaurant";
import Register from "./pages/Register";
import ResetIdPw from "./pages/ResetIdPw";
import RestaurantManage from "./pages/admin/RestaurantManage";
import RestaurantRegister from "./pages/owner/RestaurantRegister";
import MyRestaurant from "./pages/owner/MyRestaurant";
import RestaurantDetails from "./pages/admin/RestaurantDetails";
import RestaurantDetail from "./pages/RestaurantDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notifications from "./pages/Notifications";
import DetailNotifications from "./pages/DetailNotifications";
import RejectRestaurant from "./pages/owner/RejectRestaurant";
import UpdateRestaurant from "./pages/owner/UpdateRestaurant";
import MenuManage from "./pages/owner/MenuManage";
import MenuUpdate from "./pages/owner/MenuUpdate";
import ReservationsManage from "./pages/owner/ReservationsManage";
import UserManage from "./pages/admin/UserManage";
import Footer from "./components/Footer";
import UserDetails from "./pages/admin/UserDetails";
import MyPage from "./pages/MyPage";
import VisitedRestaurant from "./pages/VisitedRestaurant";
import RecommendMenu from "./pages/RecommendMenu";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  onMessageListener,
  requestForToken,
  sendTokenToServer,
} from "./firebase";

function App() {
  const { accessToken } = useSelector((state) => state.authToken);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        requestForToken().then((token) => {
          if (token) {
            sendTokenToServer(token, accessToken);
          }
        });
      } else {
        console.log("알림 권한이 거부되었습니다.");
      }
    } catch (error) {
      console.error("알림 권한 요청 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    requestNotificationPermission();

    onMessageListener()
      .then((payload) => {
        if (Notification.permission === "granted") {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: "/fcmIcon.png", // 알림 아이콘 경로
          });
        }
      })
      .catch((err) => console.error("Error receiving message: ", err));
  }, [accessToken]);
  return (
    <div className="flex min-h-screen flex-col">
      <BrowserRouter>
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/recommend-menu" element={<RecommendMenu />}></Route>
            <Route path="/" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/reset-idpw" element={<ResetIdPw />}></Route>
            <Route path="/restaurant/:name" element={<Restaurant />}></Route>
            <Route path="/mypage" element={<MyPage />}></Route>
            <Route
              path="/visited-restaurants"
              element={<VisitedRestaurant />}
            ></Route>
            <Route
              path="/restaurant/:name/details/:restaurantId"
              element={<RestaurantDetail />}
            />
            <Route path="*" element={<NotFound />}></Route>

            <Route
              path="/owner/restaurant/register"
              element={<RestaurantRegister />}
            ></Route>
            <Route
              path="/owner/my-restaurant"
              element={<MyRestaurant />}
            ></Route>
            <Route
              path="/owner/reject-restaurant"
              element={<RejectRestaurant />}
            ></Route>
            <Route
              path="/owner/update-restaurant/:restaurantId"
              element={<UpdateRestaurant />}
            ></Route>
            <Route path="/notifications" element={<Notifications />}></Route>
            <Route
              path="/notifications/detail/:notificationId"
              element={<DetailNotifications />}
            ></Route>
            <Route
              path="/owner/menu-manage/:restaurantId"
              element={<MenuManage />}
            ></Route>
            <Route
              path="/owner/menu-manage/:restaurantId/update/:menuId"
              element={<MenuUpdate />}
            ></Route>
            <Route
              path="/owner/reservations-manage/:restaurantId/"
              element={<ReservationsManage />}
            ></Route>

            <Route
              path="admin/restaurant/manage"
              element={<RestaurantManage />}
            ></Route>
            <Route
              path="/admin/restaurant/manage/detail/:restaurantId"
              element={<RestaurantDetails />}
            ></Route>
            <Route path="admin/user/manage" element={<UserManage />}></Route>
            <Route
              path="/admin/user/manage/detail/:userId"
              element={<UserDetails />}
            ></Route>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
