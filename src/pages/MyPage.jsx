import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useSelector } from "react-redux";
import { decodeToken } from "../utils/decodeToken";
import Button from "../components/Button";
import { greenLine, inputStyle, redLine, tomatoBtn } from "../constants/style";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [myInfo, setMyInfo] = useState({});
  const { accessToken } = useSelector((state) => state.authToken);
  const [birth, setBirth] = useState("");
  const [nickname, setNickname] = useState("");
  const [valNickname, setValNickname] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [currentPassCheck, setCurrentPassCheck] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    watch,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm({ mode: "onChange" });

  const getMyInfo = async () => {
    const config = {
      headers: {
        Authorization: accessToken.token,
      },
    };

    try {
      const res = await api.get(`/users`, config);
      setMyInfo(res.data);
      setNickname(res.data.nickname);
      setBirth(res.data.age);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyInfo();
  }, [accessToken]);

  const onBirthChange = (e) => {
    setBirth(e.target.value);
  };

  const onNicknameChange = (e) => {
    setNickname(e.target.value);
    setValNickname(null);
  };

  const onCurrentPasswordInputChange = (e) => {
    setCurrentPasswordInput(e.target.value);
  };

  const checkCurrentPass = async () => {
    const config = {
      headers: {
        Authorization: accessToken.token,
      },
    };

    const data = {
      password: currentPasswordInput,
    };
    try {
      const res = await api.post("users/check-password", data, config);
      if (res.data.response) {
        setCurrentPassCheck(true);
      } else {
        setCurrentPassCheck(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changePassword = async () => {
    const config = {
      headers: {
        Authorization: accessToken.token,
      },
    };

    const data = {
      currentPassword: currentPasswordInput,
      newPassword: passwordInput,
    };

    try {
      const res = await api.patch("/users/password", data, config);
      alert(JSON.stringify(res.data.response));
    } catch (err) {
      console.error(err);
    }
  };

  const checkNickname = async () => {
    try {
      const nickname = watch("nickname"); // 현재 입력된 닉네임 가져오기
      const res = await api.get("/public/users/check-nickname", {
        params: { nickname: nickname },
      });

      if (!res.data.response) {
        setValNickname(false);
      } else {
        setValNickname(true);
      }
    } catch (err) {
      setValNickname(true);
    }
  };

  const reviseMyInfo = async () => {
    const config = {
      headers: {
        Authorization: accessToken.token,
      },
    };

    const data = {
      nickname: nickname,
      age: birth,
    };

    try {
      const res = await api.put("/users", data, config);
      alert("정상적으로 수정하였습니다. 로그아웃 후 갱신이 됩니다.");
    } catch (err) {
      console.error(err);
    }
  };

  const withdraw = async () => {
    const config = {
      headers: {
        Authorization: accessToken.token,
      },
    };
    try {
      const res = await api.delete("/users", config);
      alert("정상적으로 회원 탈퇴하였습니다. \n이용해주셔서 감사합니다.");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex flex-col gap-4">
            <p className="font-bold">나의 정보</p>
            <div className="flex flex-col gap-3 bg-neutral-100 p-4 shadow-lg">
              <p>유저 고유 번호 : {myInfo.id}</p>
              <p>아이디 : {myInfo.username}</p>
              <p>역할 : {myInfo.role}</p>
              <p>닉네임 : {myInfo.nickname}</p>
              <p>이메일 : {myInfo.email}</p>
              <p>나이 : {myInfo.age}</p>
              <p>가입 일자 : {myInfo.createdTime}</p>
            </div>

            <div>
              <p className="mb-2 font-bold">정보 수정</p>
              <form className="flex flex-col gap-3 bg-neutral-100 p-4 shadow-lg">
                <label htmlFor="nickname">닉네임</label>
                <input
                  type="text"
                  className={`${watch("nickname") ? (errors.nickname || valNickname === true || valNickname === null ? redLine : greenLine) : undefined} ${inputStyle} flex-grow`}
                  value={nickname}
                  id="nickname"
                  {...register("nickname", {
                    required: "닉네임은 필수 입력입니다.",
                    pattern: {
                      value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]{2,10}$/,
                      message: "특수문자를 제외한 2~10자리여야 합니다.",
                    },
                    onChange: onNicknameChange,
                  })}
                />
                <Button
                  style="text-sm disabled:opacity-40"
                  onClick={checkNickname}
                  disabled={!watch("nickname") || errors.nickname}
                  type="button"
                >
                  중복 확인
                </Button>
                {errors.nickname && (
                  <small className="text-red-500">
                    {errors.nickname.message}
                  </small>
                )}

                {!errors.nickname &&
                  valNickname === null &&
                  watch("nickname") && (
                    <small className="text-red-500">
                      중복 확인을 해주세요.
                    </small>
                  )}

                {!errors.nickname && valNickname === false && (
                  <small className="text-green-500">
                    사용 가능한 닉네임입니다.
                  </small>
                )}
                {!errors.nickname && valNickname === true && (
                  <small className="text-red-500">중복된 닉네임입니다.</small>
                )}

                <label htmlFor="age">나이</label>
                <input
                  type="date"
                  className={inputStyle}
                  value={birth}
                  onChange={onBirthChange}
                />
              </form>

              <Button
                className={`${tomatoBtn} float-right mt-2 cursor-pointer disabled:opacity-50`}
                disabled={
                  isSubmitting ||
                  (!errors.nickname &&
                    valNickname === null &&
                    watch("nickname")) ||
                  (!errors.nickname && valNickname === true) ||
                  errors.nickname
                }
                onClick={() => {
                  if (confirm("정말로 회원 수정하시겠습니까?")) {
                    reviseMyInfo();
                  }
                }}
              >
                수정하기
              </Button>
            </div>

            <div>
              <p className="mb-2 font-bold">비밀번호 변경</p>
              <form
                className="flex flex-col gap-3 bg-neutral-100 p-4 shadow-lg"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="current-password" className="text-sm">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  className={`${inputStyle} text-sm`}
                  placeholder="현재 비밀번호를 입력해주세요."
                  onChange={onCurrentPasswordInputChange}
                />
                <Button onClick={checkCurrentPass}>확인하기</Button>
                {currentPassCheck === null && (
                  <small className="text-red-500">
                    현재 비밀번호를 확인해주세요.
                  </small>
                )}
                {currentPassCheck === false && (
                  <small className="text-red-500">
                    현재 비밀번호와 일치하지 않습니다.
                  </small>
                )}
                {currentPassCheck === true && (
                  <small className="text-green-500">확인되었습니다.</small>
                )}

                <label htmlFor="password" className="cursor-pointer text-sm">
                  새로운 비밀번호
                </label>
                <div className="relative flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`${watch("password") ? (errors.password ? redLine : greenLine) : undefined} ${inputStyle} flex-grow`}
                    maxLength="16"
                    placeholder="숫자, 특수문자 포함 8~16자"
                    {...register("password", {
                      required: "비밀번호는 필수 입력입니다.",
                      pattern: {
                        value: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W).{8,16}/,
                        message: "숫자, 특수문자 포함 8~16자리여야 합니다.",
                      },
                      onChange: (e) => setPasswordInput(e.target.value),
                    })}
                  />
                  {passwordInput.length > 0 && (
                    <span
                      className="material-symbols-outlined absolute right-2 top-2 cursor-pointer text-slate-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Lock_open" : "Lock"}
                    </span>
                  )}
                </div>
                {errors.password && (
                  <small className="text-red-500">
                    {errors.password.message}
                  </small>
                )}

                <label htmlFor="password" className="cursor-pointer text-sm">
                  새로운 비밀번호 2차 확인
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`${watch("passwordConfirm") ? (errors.passwordConfirm ? redLine : greenLine) : undefined} ${inputStyle}`}
                  maxLength="16"
                  placeholder="********"
                  {...register("passwordConfirm", {
                    required: "2차 확인은 필수 입력입니다.",
                    validate: (value) =>
                      value === watch("password") ||
                      "비밀번호가 일치하지 않습니다.",
                  })}
                />
                {errors.passwordConfirm && (
                  <small className="text-red-500">
                    {errors.passwordConfirm.message}
                  </small>
                )}
                <Button
                  className={`${tomatoBtn} disabled:opacity-50`}
                  disabled={
                    currentPassCheck !== true ||
                    errors.password ||
                    errors.passwordConfirm ||
                    !watch("password") ||
                    !watch("passwordConfirm")
                  }
                  onClick={() => {
                    if (confirm("정말로 비밀번호를 변경 하시겠습니까?")) {
                      changePassword();
                    }
                  }}
                >
                  변경하기
                </Button>
              </form>
            </div>
          </div>
          <Button
            className={tomatoBtn}
            style={`float-right mt-20`}
            onClick={() => {
              if (confirm("정말로 회원 탈퇴하시겠습니까?")) {
                withdraw();
              }
            }}
          >
            탈퇴하기
          </Button>
        </div>
      )}
    </div>
  );
}
