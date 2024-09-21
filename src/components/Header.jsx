import { useState, useEffect } from "react";
import Button from "./Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { btn, tomatoBtn } from "../constants/style";
import { api } from "../services/api";
import Modal from "./Modal";
import { useShowMobile } from "../hooks/useShowMobile";
import { decodeToken } from "../utils/decodeToken";

export default function Header() {
  const [menuBar, setMenuBar] = useState(false);
  const navigate = useNavigate();
  const { authenticated, nickname, accessToken } = useSelector(
    (state) => state.authToken,
  );
  const [token, setToken] = useState(null);

  const inView = useSelector((state) => state.inView);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const { showMobile, isModalOpen, setIsModalOpen } = useShowMobile();

  const contentMotion = {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 200 },
    transition: {
      type: "spring",
      stiffness: 2000,
      damping: 250,
      duration: 0.5,
    },
  };

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
          ? `fixed left-0 top-0 z-20 flex h-20 w-full items-center justify-between px-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72 ${isHomePage && inView ? undefined : "border-b bg-white"}`
          : `relative z-20 flex h-20 items-center justify-between border-b px-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72`
      }
    >
      <div>
        <span
          className={`cursor-pointer text-2xl font-bold ${isHomePage && inView ? "text-white" : "text-tomato-color"}`}
          onClick={() => navigate("/")}
        >
          Table For You
        </span>
      </div>
      <div>
        {!showMobile ? (
          authenticated ? (
            <div className="relative">
              <div
                className={`${btn} flex items-center gap-1 ${isHomePage && inView && "bg-white"}`}
                onClick={() => setMenuBar(!menuBar)}
              >
                <span className="text-sm">{nickname}</span>
                <span className="material-symbols-outlined">menu</span>
              </div>
              {menuBar && (
                <div className="absolute h-auto w-[15vw] rounded-lg bg-white shadow-md">
                  <div className="flex cursor-pointer items-center justify-between border-b p-2 text-sm hover:bg-gray-100">
                    <p>{nickname}님 반가워요👋</p>
                    <span className="material-symbols-outlined cursor-pointer">
                      arrow_circle_right
                    </span>
                  </div>
                  <div className="mt- cursor-pointer border-b p-2 text-sm hover:bg-gray-100">
                    <p>로그아웃</p>
                  </div>
                  {token.role === "OWNER" && (
                    <>
                      <div
                        className="mt- cursor-pointer border-b p-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          navigate("/owner/restaurant/register"),
                            setMenuBar(false);
                        }}
                      >
                        <p>식당 추가</p>
                      </div>
                      <div
                        className="mt- cursor-pointer border-b p-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          navigate("/owner/my-restaurant"), setMenuBar(false);
                        }}
                      >
                        <p>나의 가게</p>
                      </div>
                      <div
                        className="mt- cursor-pointer border-b p-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          navigate("/owner/notifications"), setMenuBar(false);
                        }}
                      >
                        <p>알림함</p>
                      </div>
                    </>
                  )}

                  {token.role === "ADMIN" && (
                    <>
                      <div
                        className="mt- cursor-pointer border-b p-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          navigate("admin/restaurant/manage"),
                            setMenuBar(false);
                        }}
                      >
                        <p>식당 승인 관리</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              style={`text-sm ${inView && "bg-white"}`}
            >
              로그인
            </Button>
          )
        ) : (
          <>
            <Button
              style={`material-symbols-outlined ${isHomePage && inView && "bg-white"}`}
              onClick={() => setIsModalOpen(!isModalOpen)} //클릭시 모바일 메뉴 오른쪽에서 왼쪽으로 슬라이드 하며 나오게 해야 함.
            >
              menu
            </Button>
            {isModalOpen && (
              <Modal
                modalOpen={isModalOpen}
                setModalOpen={setIsModalOpen}
                parentClass={
                  "fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-50"
                }
                childClass={
                  "z-50 h-full w-full bg-neutral-100 sm:w-[60%] md:w-[50%]"
                }
                contentMotion={contentMotion}
              >
                {authenticated ? (
                  <div className="mt-10 flex flex-col gap-3 p-2">
                    <div className="w-full p-4 text-center shadow-lg">
                      <p>{nickname}님 반가워요👋</p>
                    </div>
                    <Button
                      onClick={() => {
                        setIsModalOpen(false);
                      }}
                      style={`${tomatoBtn} w-full`}
                    >
                      로그아웃
                    </Button>

                    {token.role === "OWNER" && (
                      <>
                        <Button
                          onClick={() => {
                            navigate("owner/restaurant/register"),
                              setIsModalOpen(false);
                          }}
                          style={`${tomatoBtn} w-full`}
                        >
                          식당 추가
                        </Button>

                        <Button
                          onClick={() => {
                            navigate("/owner/my-restaurant"),
                              setIsModalOpen(false);
                          }}
                          style={`${tomatoBtn} w-full`}
                        >
                          나의 가게
                        </Button>
                        <Button
                          onClick={() => {
                            navigate("/owner/notifications"),
                              setIsModalOpen(false);
                          }}
                          style={`${tomatoBtn} w-full`}
                        >
                          알림함
                        </Button>
                      </>
                    )}

                    {token.role === "ADMIN" && (
                      <Button
                        onClick={() => {
                          navigate("admin/restaurant/manage"),
                            setIsModalOpen(false);
                        }}
                        style={`${tomatoBtn} w-full`}
                      >
                        식당 승인 관리
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="mt-10 flex p-2">
                    <Button
                      onClick={() => {
                        setIsModalOpen(false), navigate("/login");
                      }}
                      style={`${tomatoBtn} w-full`}
                    >
                      로그인
                    </Button>
                  </div>
                )}
              </Modal>
            )}
          </>
        )}
      </div>
    </header>
  );
}
