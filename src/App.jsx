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

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/reset-idpw" element={<ResetIdPw />}></Route>
            <Route path="/restaurant/:name" element={<Restaurant />}></Route>
            <Route path="/mypage" element={<MyPage />}></Route>
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
              element={<MyRestaurant />}>
            </Route>
            <Route
              path="/owner/reject-restaurant"
              element={<RejectRestaurant />}
            >
            </Route>
            <Route
              path="/owner/update-restaurant/:restaurantId"
              element={<UpdateRestaurant />}
            >
            </Route>
            <Route
              path="/notifications"
              element={<Notifications />}
            ></Route>
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
              element={<MenuUpdate />
              }
            ></Route>
            <Route
              path="/owner/reservations-manage/:restaurantId/"
              element={<ReservationsManage />
              }
            ></Route>

            <Route
              path="admin/restaurant/manage"
              element={<RestaurantManage />}
            ></Route>
            <Route
              path="/admin/restaurant/manage/detail/:restaurantId"
              element={<RestaurantDetails />}
            ></Route>
            <Route
              path="admin/user/manage"
              element={<UserManage />}
            ></Route>
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
