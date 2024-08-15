import { useState, useEffect } from "react";
import Button from "./Button";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { btn } from "../constants/style";
import { api } from "../services/api";


export default function Header() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [menuBar, setMenuBar] = useState(false);
  const navigate = useNavigate();
  const { authenticated, nickname, accessToken } = useSelector((state) => state.authToken);
  
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
    <header className="flex h-20 items-center justify-around border-b">
      <div>
        <span
          className="cursor-pointer text-2xl font-bold text-tomato-color"
          onClick={() => navigate("/")}
        >
          Table For You
        </span>
      </div>
      <div>
        {windowWidth > 768 ? (
          authenticated ?
            (
              <div className="relative">
                <div className={`${btn} flex gap-1 items-center`} onClick={() => setMenuBar(!menuBar)}  >
                  <span className="text-sm">{nickname}</span>
                  <span className="material-symbols-outlined">menu</span>
                </div>
                {
                  menuBar &&
                  <div className="absolute w-[15vw] h-40 rounded-lg bg-white shadow-md">
                    <div className="flex items-center justify-between cursor-pointer text-sm border-b p-2 hover:bg-gray-100">
                      <p>{nickname}님 반가워요👋</p>
                      <span className="material-symbols-outlined cursor-pointer">
                        arrow_circle_right
                      </span>
                    </div>
                    <div className="cursor-pointer text-sm border-b p-2 hover:bg-gray-100">
                      <p>로그아웃</p>
                    </div>
                  </div>
                }

              </div>
            ) :
            < Button onClick={() => navigate("/login")}>로그인</Button>

        ) : (
          <Button style="material-symbols-outlined">menu</Button>
        )}
      </div>

    </header >
  );
}
