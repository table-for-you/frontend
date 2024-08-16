import { useState, useEffect } from "react";
import Button from "./Button";
import { debounce } from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { btn } from "../constants/style";
import { api } from "../services/api";

export default function Header() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [menuBar, setMenuBar] = useState(false);
  const navigate = useNavigate();
  const { authenticated, nickname, accessToken } = useSelector(
    (state) => state.authToken,
  );

  const inView = useSelector((state) => state.inView);



  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200);
    addEventListener("resize", handleResize);
    return () => removeEventListener("resize", handleResize);
  });

  // const logout = () => {
  //   try {
  //     const res = api.get('/api/logout', {
  //       headers: {
  //         Authorization: `${accessToken.token}`
  //       }
  //     });

  //     console.log(res);
  //     navigate('/');
  //   } catch (err) {
  //     alert(JSON.stringify(err.response.data.message));
  //   }
  // }

  return (
    <header
      className={
        isHomePage
          ? `fixed left-0 top-0 z-20 flex h-20 w-full items-center justify-around 
          ${(isHomePage && inView) ? undefined : "border-b bg-white"}`
          : `relative z-20 flex h-20 items-center justify-around border-b`
      }
    >

      <div>
        <span
          className={`cursor-pointer text-2xl font-bold ${(isHomePage && inView) ? 'text-white' : "text-tomato-color"}`}
          onClick={() => navigate("/")}
        >
          Table For You
        </span>
      </div>
      <div>
        {windowWidth > 768 ? (
          authenticated ? (
            <div className="relative">
              <div
                className={`${btn} flex items-center gap-1`}
                onClick={() => setMenuBar(!menuBar)}
              >
                <span className="text-sm">{nickname}</span>
                <span className="material-symbols-outlined">menu</span>
              </div>
              {menuBar && (
                <div className="absolute h-40 w-[15vw] rounded-lg bg-white shadow-md">
                  <div className="flex cursor-pointer items-center justify-between border-b p-2 text-sm hover:bg-gray-100">
                    <p>{nickname}님 반가워요👋</p>
                    <span className="material-symbols-outlined cursor-pointer">
                      arrow_circle_right
                    </span>
                  </div>
                  <div className="cursor-pointer border-b p-2 text-sm hover:bg-gray-100">
                    <p>로그아웃</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={() => navigate("/login")} style={`text-sm ${inView && "bg-white"}`}>
              로그인
            </Button>
          )
        ) : (
          <Button style={`material-symbols-outlined ${isHomePage && inView && "bg-white"}`}>menu</Button>
        )}
      </div>
    </header>
  );
}
