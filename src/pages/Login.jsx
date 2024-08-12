import { useForm } from "react-hook-form";
import { useState } from "react";
import Button from "../components/Button";
import { tomatoBtn, redLine, greenLine, inputStyle } from "../constants/style";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const {
    register,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm({ mode: "onChange" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();


  return (
    <>
      <div className="grid h-[calc(100vh-20rem)] place-items-center">
        <form
          className="relative flex w-full flex-col gap-2 px-4 sm:w-1/2 lg:w-1/3 xl:w-1/4"
          onSubmit={e => e.preventDefault()}
        >
          <label className="cursor-pointer text-sm" htmlFor="id">
            아이디
          </label>
          <input
            className={`${isSubmitted ? (errors.id ? redLine : greenLine) : undefined} ${inputStyle}`}
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
              className={`${isSubmitted ? (errors.password ? redLine : greenLine) : undefined} ${inputStyle} flex-grow`}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              {...register("password", {
                required: "비밀번호는 필수 입력입니다.",
                onChange: (e) => setPasswordInput(e.target.value),
              })}
              maxLength="16"
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
            className={`${tomatoBtn} disabled:opacity-75`}
            disabled={isSubmitting}
          >
            로그인
          </Button>
          <div className="flex justify-end">
            <small>비밀번호 재설정</small>
          </div>
          <p className="m-auto text-sm text-zinc-500">계정이 없으신가요?</p>
          <span
            className="m-auto cursor-pointer disabled:opacity-40"
            onClick={() => navigate("/register")}
            disabled
          >
            회원가입
          </span>
        </form>
      </div>
    </>
  );
}
