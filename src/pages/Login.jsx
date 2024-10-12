import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../components/Button";
import { tomatoBtn, inputStyle } from "../constants/style";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { SET_TOKEN } from "../store/auth";

export default function Login() {
  const {
    register,
    watch,
    getValues,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm({ mode: "onChange" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async () => {
    const data = {
      username: watch("id"),
      password: watch("password"),
    };
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    // 쿠키 추후 (why? https 설정 문제로 인해)
    try {
      const res = await api.post("/api/login", data, config);

      if (res.status >= 200 && res.status < 300) {
        const { accessToken, nickname } = res.data;
        dispatch(SET_TOKEN({ token: accessToken, nickname }));
        navigate("/");
      }
    } catch (err) {
      setLoginErrorMessage(err.response.data.message);
    }
  };

  return (
    <>
      <div className="grid h-[calc(100vh-20rem)] place-items-center">
        <form
          className="relative flex w-full flex-col gap-2 px-4 sm:w-1/2 lg:w-1/3 xl:w-1/4"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="cursor-pointer text-sm" htmlFor="id">
            아이디
          </label>
          <input
            className={`${inputStyle} flex-grow`}
            id="id"
            type="text"
            placeholder="TableForYou"
            {...register("id", {
              required: "아이디는 필수 입력입니다.",
            })}
            maxLength="20"
          />
          {errors.id && (
            <small className="text-red-500">{errors.id.message}</small>
          )}

          <label className="cursor-pointer text-sm" htmlFor="password">
            비밀번호
          </label>
          <div className="relative flex">
            <input
              className={`${inputStyle} flex-grow`}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              {...register("password", {
                required: "비밀번호는 필수 입력입니다.",
                onChange: (e) => setPasswordInput(e.target.value),
              })}
            />
            {passwordInput.length > 0 && (
              <span
                className="material-symbols-outlined absolute bottom-[0.4rem] right-2 cursor-pointer text-slate-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Lock_open" : "Lock"}
              </span>
            )}
          </div>

          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
          <Button
            className={`${tomatoBtn} cursor-pointer disabled:opacity-75`}
            disabled={
              errors.id ||
              errors.password ||
              !getValues("id") || // 헤더의 로그인 버튼으로 인해 disabeld 풀리는 것 방지
              !getValues("password")
            }
            onClick={login}
          >
            로그인
          </Button>
          {loginErrorMessage && (
            <small className="text-red-500">{loginErrorMessage}</small>
          )}

          <div className="flex justify-end">
            <small className="cursor-pointer border-b border-transparent hover:border-black">
              <Link to="/reset-idpw">ID/PW 재설정</Link>
            </small>
          </div>
          <p className="m-auto text-sm text-zinc-500">계정이 없으신가요?</p>
          <span
            className="m-auto cursor-pointer border-b border-transparent hover:border-black"
            onClick={() => navigate("/register")}
          >
            회원가입
          </span>
        </form>
      </div>
    </>
  );
}
