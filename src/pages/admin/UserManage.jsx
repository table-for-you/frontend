import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import Button from "../../components/Button";
import { tomatoBtn } from "../../constants/style";
import Loading from "../../components/Loading";

export default function UserManage() {
  const [userList, setUserList] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");
  const { accessToken } = useSelector((state) => state.authToken);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getUserList = async () => {
    if (accessToken) {
      const decoded = decodeToken(JSON.stringify(accessToken));
      if (decoded.role === "ADMIN") {
        const config = {
          headers: {
            Authorization: `${accessToken.token}`, // accessToken을 헤더에 추가
          },
        };

        try {
          const res = await api.get(`/admin/users?pageable=1`, config);
          setUserList(res.data.content);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      alert("권한이 없습니다.");
      useNavigate("/");
    }
  };

  const searchUserList = async (keyword) => {
    if (accessToken) {
      const decoded = decodeToken(JSON.stringify(accessToken));
      if (decoded.role === "ADMIN") {
        const params = {
          type: "nickname",
          "search-keyword": keyword,
        };
        const config = {
          headers: {
            Authorization: `${accessToken.token}`, // accessToken을 헤더에 추가
          },
          params: params,
        };

        try {
          const res = await api.get(`/admin/users?pageable=1`, config);
          setSearchUsers(res.data.content);
          console.log(res.data.content);
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      alert("권한이 없습니다.");
      useNavigate("/");
    }
  };

  const deleteUser = async (userId) => {
    if (accessToken) {
      const decoded = decodeToken(JSON.stringify(accessToken));
      if (decoded.role === "ADMIN") {
        const config = {
          headers: {
            Authorization: accessToken.token,
          },
        };

        try {
          const res = await api.delete(`/admin/users/${userId}`, config);
          alert("정상적으로 삭제하였습니다.");
          getUserList();
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      alert("권한이 없습니다.");
      useNavigate("/");
    }
  };

  useEffect(() => {
    getUserList();
  }, [accessToken, navigate]);

  const handleInputChange = (e) => {
    setSearchInputValue(e.target.value);
  };

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="mb-2 text-lg font-bold">회원 검색</p>
              <div className="flex items-center space-x-2 rounded-lg bg-white p-3 text-sm shadow-md">
                <input
                  type="text"
                  value={searchInputValue}
                  onChange={handleInputChange}
                  placeholder="회원 검색"
                  className="rounded-md border border-gray-300 px-1 py-1 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchUserList(searchInputValue);
                    }
                  }}
                />
                <span
                  className="material-symbols-outlined cursor-pointer rounded-md bg-red-500 p-0.5 text-white transition duration-200 hover:bg-red-600"
                  onClick={() => searchUserList(searchInputValue)}
                >
                  search
                </span>
              </div>
            </div>
            {searchUsers.map((user) => (
              <div
                key={user.id}
                className="mb-1 flex justify-between rounded-lg bg-neutral-100 p-5 shadow-lg"
              >
                <div>
                  <p>유저 고유 번호 : {user.id}</p>
                  <p>닉네임 : {user.nickname}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <Button
                    onClick={() =>
                      navigate(`/admin/user/manage/detail/${user.id}`)
                    }
                  >
                    자세히 보기
                  </Button>
                  <Button
                    className={tomatoBtn}
                    onClick={() => {
                      if (confirm("정말로 회원을 삭제하시겠습니까?")) {
                        deleteUser(user.id);
                      }
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}

            <div>
              <p className="mb-2 text-lg font-bold">관리자 목록</p>
              {userList
                .filter((user) => user.role === "ADMIN")
                .map((user) => (
                  <div
                    key={user.id}
                    className="mb-1 flex justify-between rounded-lg bg-neutral-100 p-5 shadow-lg"
                  >
                    <div>
                      <p>유저 고유 번호 : {user.id}</p>
                      <p>닉네임 : {user.nickname}</p>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <Button
                        onClick={() =>
                          navigate(`/admin/user/manage/detail/${user.id}`)
                        }
                      >
                        자세히 보기
                      </Button>
                      <Button
                        className={tomatoBtn}
                        onClick={() => {
                          if (confirm("정말로 회원을 삭제하시겠습니까?")) {
                            deleteUser(user.id);
                          }
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <p className="mb-2 text-lg font-bold">점주 목록</p>
              {userList
                .filter((user) => user.role === "OWNER")
                .map((user) => (
                  <div
                    key={user.id}
                    className="mb-1 flex justify-between rounded-lg bg-neutral-100 p-5 shadow-lg"
                  >
                    <div>
                      <p>유저 고유 번호 : {user.id}</p>
                      <p>닉네임 : {user.nickname}</p>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <Button
                        onClick={() =>
                          navigate(`/admin/user/manage/detail/${user.id}`)
                        }
                      >
                        자세히 보기
                      </Button>
                      <Button
                        className={tomatoBtn}
                        onClick={() => {
                          if (confirm("정말로 회원을 삭제하시겠습니까?")) {
                            deleteUser(user.id);
                          }
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <p className="mb-2 text-lg font-bold">손님 목록</p>
              {userList
                .filter((user) => user.role === "USER")
                .map((user) => (
                  <div
                    key={user.id}
                    className="mb-1 flex justify-between rounded-lg bg-neutral-100 p-5 shadow-lg"
                  >
                    <div>
                      <p>유저 고유 번호 : {user.id}</p>
                      <p>닉네임 : {user.nickname}</p>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <Button
                        onClick={() =>
                          navigate(`/admin/user/manage/detail/${user.id}`)
                        }
                      >
                        자세히 보기
                      </Button>
                      <Button
                        className={tomatoBtn}
                        onClick={() => {
                          if (confirm("정말로 회원을 삭제하시겠습니까?")) {
                            deleteUser(user.id);
                          }
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
