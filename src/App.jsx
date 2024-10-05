import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Region from "./pages/Region";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import RestaurantManage from "./pages/admin/RestaurantManage";
import RestaurantRegister from "./pages/owner/RestaurantRegister";
import MyRestaurant from "./pages/owner/MyRestaurant";
import RestaurantDetails from "./pages/admin/RestaurantDetails";
import RegionDetail from "./pages/RegionDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Notifications from "./pages/Notifications";
import DetailNotifications from "./pages/DetailNotifications";
import RejectRestaurant from "./pages/owner/RejectRestaurant";
import UpdateRestaurant from "./pages/owner/UpdateRestaurant";
import MenuManage from "./pages/owner/MenuManage";
import MenuUpdate from "./pages/owner/MenuUpdate";
import ReservationsManage from "./pages/owner/ReservationsManage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/reset-password" element={<ResetPassword />}></Route>
          <Route path="/region/:name" element={<Region />}></Route>
          <Route
            path="/region/:name/restaurant/:restaurantId"
            element={<RegionDetail />}
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

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
