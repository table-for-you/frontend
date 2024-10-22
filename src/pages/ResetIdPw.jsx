import { useState } from "react";
import { useForm } from "react-hook-form";
import { greenLine, inputStyle, redLine, tomatoBtn } from "../constants/style";
import Button from "../components/Button";
import { api } from "../services/api";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

export default function ResetIdPw() {
  const {
    register,
    watch,
    getValues,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm({ mode: "onChange" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [notFoundId, setNotFoundId] = useState("");
  const [yourId, setYourId] = useState(null);

  const contentMotion = {
    initial: { opacity: 0, y: -200 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -200 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.5,
    },
  };

  const navigate = useNavigate();

  const findId = async () => {
    const params = {
      email: watch("findIdEmail"),
    };

    const config = {
      params: params,
    };

    try {
      const res = await api.get(`/api/find-id`, config);
      setYourId(res.data.response);
      setIsIdModalOpen(true);
      setNotFoundId("");
    } catch (err) {
      setNotFoundId(err.response.data.message);
    }
  };

  const findPass = async () => {
    const email = watch("email");
    const username = watch("id");

    try {
      const res = await api.post(
        `/api/find-pass?email=${encodeURIComponent(email)}&username=${username}`,
      );
      setIsPwModalOpen(true);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err.response.data.message);
    }
  };

  return (
    <>
      <div className="grid h-[calc(100vh-10rem)] place-items-center">
        <form
          onSubmit={(e) => e.preventDefault()}
          // className="sm:w-1/2 lg:w-1/3 xl:w-1/4"
          className="flex flex-col gap-10 sm:flex-row"
        >
          <div>
            <p className="text-lg font-bold">아이디 찾기</p>
            <p className="mb-2 text-sm text-gray-400">
              회원가입 시 등록한 이메일 주소를 입력해 주세요.
            </p>
            <div className="flex flex-col">
              <label htmlFor="findIdEmail" className="text-xs">
                이메일
              </label>
              <input
                type="email"
                id="findIdEmail"
                className={`${watch("findIdEmail") ? (errors.findIdEmail ? redLine : greenLine) : undefined} ${inputStyle} mb-2`}
                placeholder="tableforyou@table.com"
                {...register("findIdEmail", {
                  required: "이메일은 필수 입력입니다.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "이메일 형식에 맞지 않습니다.",
                  },
                })}
              />
              {errors.findIdEmail && (
                <small className="mb-2 text-red-500">
                  {errors.findIdEmail.message}
                </small>
              )}
              <Button
                className={`${tomatoBtn}`}
                style={"w-full mt-2 disabled:opacity-50"}
                disabled={
                  isSubmitting ||
                  errors.findIdEmail ||
                  watch("findIdEmail") === "" ||
                  !getValues("findIdEmail")
                }
                onClick={findId}
              >
                확인
              </Button>
            </div>
            {notFoundId !== "" && (
              <small className="mt-2 flex justify-center text-red-500">
                {notFoundId}
              </small>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-lg font-bold">비밀번호 재설정</p>
            <p className="text-sm text-gray-400">
              회원가입 시 등록한 이메일 주소를 입력해 주세요.
            </p>
            <label htmlFor="email" className="text-xs">
              이메일
            </label>
            <input
              type="email"
              id="email"
              className={`${watch("email") ? (errors.email ? redLine : greenLine) : undefined} ${inputStyle} mb-2`}
              placeholder="tableforyou@table.com"
              {...register("email", {
                required: "이메일은 필수 입력입니다.",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "이메일 형식에 맞지 않습니다.",
                },
              })}
            />
            {errors.email && (
              <small className="mb-2 text-red-500">
                {errors.email.message}
              </small>
            )}

            <label htmlFor="id" className="text-xs">
              아이디
            </label>
            <input
              type="id"
              id="id"
              className={`${watch("id") ? (errors.id ? redLine : greenLine) : undefined} ${inputStyle} mb-2`}
              placeholder="tableforyou"
              {...register("id", {
                required: "아이디는 필수 입력입니다.",
                pattern: {
                  value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]{4,20}$/,
                  message: "특수문자를 제외한 4~20자리여야 합니다.",
                },
              })}
            />
            {errors.id && (
              <small className="text-red-500">{errors.id.message}</small>
            )}
            <Button
              className={`${tomatoBtn}`}
              style={"w-full mt-2 disabled:opacity-50"}
              disabled={
                isSubmitting ||
                errors.email ||
                errors.id ||
                watch("email") === "" ||
                watch("id") === "" ||
                !getValues("email") ||
                !getValues("id")
              }
              onClick={findPass}
            >
              확인
            </Button>
          </div>
          {errorMessage !== "" && (
            <small className="mt-2 flex justify-center text-red-500">
              {errorMessage}
            </small>
          )}
        </form>
      </div>
      <Modal
        modalOpen={isIdModalOpen}
        setModalOpen={setIsIdModalOpen}
        parentClass={
          "fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        }
        childClass={"relative bg-neutral-100 p-6 rounded-lg text-center"}
        contentMotion={contentMotion}
      >
        <div className="mb-2 flex flex-grow flex-col items-center justify-center">
          <p className="pb-6 sm:text-lg">{watch("findIdEmail")}의 아이디</p>
          <p className="mb-1 bg-green-100 p-1">{yourId}</p>
        </div>
        <div className="mt-auto w-full">
          <Button
            className={tomatoBtn}
            style={"w-full text-sm"}
            onClick={() => navigate("/login")}
          >
            로그인 하러 가기
          </Button>
        </div>
      </Modal>
      <Modal
        modalOpen={isPwModalOpen}
        setModalOpen={setIsPwModalOpen}
        parentClass={
          "fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        }
        childClass={"relative bg-neutral-100 p-6 rounded-lg text-center"}
        contentMotion={contentMotion}
      >
        <div className="mb-2 flex flex-grow flex-col items-center justify-center">
          <p className="pb-6 sm:text-lg">임시 비밀번호가 전송되었어요!</p>
          <p>로그인 후 회원정보에서</p>
          <p>비밀번호를 변경해주세요.</p>
        </div>
        <div className="mt-auto w-full">
          <Button
            className={tomatoBtn}
            style={"w-full text-sm"}
            onClick={() => navigate("/login")}
          >
            로그인 하러 가기
          </Button>
        </div>
      </Modal>
    </>
  );
}
