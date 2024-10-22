import { useForm } from "react-hook-form";
import { tomatoBtn, redLine, greenLine, inputStyle } from "../constants/style";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { api } from "../services/api";
import Modal from "../components/Modal";

export default function Register() {
  const {
    register,
    watch,
    formState: { isSubmitting, isSubmitted, errors },
    trigger,
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreeChecked, setAgreeChecked] = useState(false);

  const [valNickname, setValNickname] = useState(null);
  const [valId, setValId] = useState(null);

  const [birth, setBirth] = useState("2000-01-01");

  const [sendMail, setSendMail] = useState({
    send: false,
    message: "",
  });
  const [count, setCount] = useState(60);
  const intervalRef = useRef(null);

  const [checkMail, setCheckMail] = useState({
    check: false,
    message: "",
  });
  const [checkCount, setCheckCount] = useState(180);
  const checkIntervalRef = useRef(null);

  const navigate = useNavigate();

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

  const checkId = async () => {
    try {
      const id = watch("id");
      const res = await api.get("/public/users/check-username", {
        params: { username: id },
      });

      if (!res.data.response) {
        setValId(false);
      } else {
        setValId(true);
      }
    } catch (err) {
      setValId(true);
    }
  };

  const checkSendMail = async () => {
    try {
      const email = watch("email");
      const res = await api.post(
        `/public/emails/verification-request?email=${encodeURIComponent(email)}`,
      );
      setSendMail((prevSendMail) => {
        return { ...prevSendMail, send: true };
      });
    } catch (err) {
      setSendMail((prevSendMail) => {
        return { ...prevSendMail, message: err.response.data.message };
      });
    }
  };

  const sendMailCount = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 60;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const checkNumMail = async () => {
    try {
      const email = watch("email");
      const emailCode = watch("emailCode");
      const res = await api.post(
        `/public/code-verification?email=${encodeURIComponent(email)}&code=${emailCode}`,
      );

      if (res.data === true) {
        setCheckMail((prevCheckMail) => {
          return { ...prevCheckMail, check: true };
        });
      }
    } catch (err) {
      setCheckMail((prevCheckMail) => {
        return { ...prevCheckMail, message: err.response.data.message };
      });
    }
  };

  const onBirthChange = (e) => {
    setBirth(e.target.value);
  };

  const signUp = async () => {
    const data = {
      nickname: watch("nickname"),
      username: watch("id"),
      password: watch("password"),
      email: watch("email"),
      age: watch("age"),
      role: watch("role"),
    };
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await api.post("/public/users/register", data, config);

      if (res.status >= 200 && res.status < 300) {
        alert(JSON.stringify(res.data.response));
        navigate("/login");
      }
    } catch (err) {
      alert(JSON.stringify(err.response.data.message));
    }
  };
  const checkMailCount = () => {
    if (checkIntervalRef.current) return;

    checkIntervalRef.current = setInterval(() => {
      setCheckCount((prevCount) => {
        if (prevCount === 0) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;

          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setCount(60);

          setSendMail((prevSendMail) => {
            return { ...prevSendMail, send: false };
          });

          setCheckMail((prevCheckMail) => {
            return { ...prevCheckMail, send: false };
          });

          return 180;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const formatTime = (count) => {
    const minutes = String(Math.floor(count / 60)).padStart(2, "0");
    const seconds = String(Math.floor(count % 60)).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  // 개인정보 활용 동의 추가 필요
  useEffect(() => {
    if (isSubmitted) {
      trigger("passwordConfirm");
    }
  }, [watch("password"), trigger, isSubmitted]);

  return (
    <>
      <div className="grid h-[100vh] place-items-center py-2">
        <form
          className="relative flex w-full flex-col gap-2 px-4 sm:w-1/2 lg:w-1/3 xl:w-1/4"
          noValidate
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="nickname" className="cursor-pointer text-sm">
            닉네임
          </label>
          <div className="relative flex">
            <input
              type="text"
              id="nickname"
              className={`${watch("nickname") ? (errors.nickname || valNickname === true || valNickname === null ? redLine : greenLine) : undefined} ${inputStyle} flex-grow`}
              maxLength="10"
              placeholder="특수문자를 제외한 2~10자"
              {...register("nickname", {
                required: "닉네임은 필수 입력입니다.",
                pattern: {
                  value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]{2,10}$/,
                  message: "특수문자를 제외한 2~10자리여야 합니다.",
                },
                onChange: () => setValNickname(null),
              })}
            />
            <Button
              style="text-sm absolute top-1 right-1 bg-white disabled:opacity-40"
              onClick={checkNickname}
              disabled={!watch("nickname") || errors.nickname}
              type="button"
            >
              중복 확인
            </Button>
          </div>
          {errors.nickname && (
            <small className="text-red-500">{errors.nickname.message}</small>
          )}

          {!errors.nickname && valNickname === null && watch("nickname") && (
            <small className="text-red-500">중복 확인을 해주세요.</small>
          )}

          {!errors.nickname && valNickname === false && (
            <small className="text-green-500">사용 가능한 닉네임입니다.</small>
          )}
          {!errors.nickname && valNickname === true && (
            <small className="text-red-500">중복된 닉네임입니다.</small>
          )}

          <label htmlFor="id" className="cursor-pointer text-sm">
            아이디
          </label>
          <div className="relative flex">
            <input
              type="text"
              id="id"
              className={`${watch("id") ? (errors.id || valId === true || valId === null ? redLine : greenLine) : undefined} ${inputStyle} flex-grow`}
              maxLength="20"
              placeholder="특수문자를 제외한 4~20자"
              {...register("id", {
                required: "아이디는 필수 입력입니다.",
                pattern: {
                  value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]{4,20}$/,
                  message: "특수문자를 제외한 4~20자리여야 합니다.",
                },
                onChange: () => setValId(null),
              })}
            />
            <Button
              style="text-sm absolute top-1 right-1 bg-white disabled:opacity-40"
              onClick={checkId}
              disabled={!watch("id") || errors.id}
              type="button"
            >
              중복 확인
            </Button>
          </div>
          {errors.id && (
            <small className="text-red-500">{errors.id.message}</small>
          )}

          {!errors.id && valId === null && watch("id") && (
            <small className="text-red-500">중복 확인을 해주세요.</small>
          )}

          {!errors.id && valId === false && (
            <small className="text-green-500">사용 가능한 아이디입니다.</small>
          )}
          {!errors.id && valId === true && (
            <small className="text-red-500">중복된 아이디입니다.</small>
          )}

          <label htmlFor="password" className="cursor-pointer text-sm">
            비밀번호
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
            <small className="text-red-500">{errors.password.message}</small>
          )}

          <label htmlFor="password" className="cursor-pointer text-sm">
            비밀번호 2차 확인
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
                value === watch("password") || "비밀번호가 일치하지 않습니다.",
            })}
          />
          {errors.passwordConfirm && (
            <small className="text-red-500">
              {errors.passwordConfirm.message}
            </small>
          )}

          <label htmlFor="email" className="cursor-pointer text-sm">
            이메일
          </label>
          <div className="relative flex">
            <input
              type="email"
              id="email"
              className={`${watch("email") ? (errors.email || !sendMail.send ? redLine : greenLine) : undefined} ${inputStyle} flex-grow truncate pr-24`}
              placeholder="tableforyou@table.com"
              {...register("email", {
                required: "이메일은 필수 입력입니다.",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "이메일 형식에 맞지 않습니다.",
                },
                onChange: () =>
                  setSendMail((prevSendMail) => {
                    return { ...prevSendMail, send: false };
                  }),
              })}
            />

            {intervalRef.current === null ? (
              <Button
                style="text-sm absolute top-1 right-1 bg-white disabled:opacity-40"
                disabled={!watch("email") || errors.email}
                onClick={() => {
                  checkSendMail();
                  sendMailCount();
                  checkMailCount();
                }}
                type="button"
              >
                번호 전송
              </Button>
            ) : (
              <Button
                style="text-sm absolute top-1 right-1 bg-white disabled:opacity-40"
                disabled
                type="button"
              >
                {formatTime(count)}
              </Button>
            )}
          </div>
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}

          {!errors.email && sendMail.send === false && watch("email") && (
            <small className="text-red-500">이메일 인증을 진행해주세요.</small>
          )}

          {!errors.email &&
            sendMail.send === false &&
            sendMail.message !== "" && (
              <small className="text-red-500">{sendMail.message}</small>
            )}

          {!errors.email && sendMail.send === true && (
            <small className="text-green-500">
              인증 번호를 전송하였습니다.
            </small>
          )}

          <label htmlFor="email-code" className="cursor-pointer text-sm">
            이메일 인증번호
          </label>
          <div className="relative flex">
            <input
              type="number"
              id="email-code"
              className={`${watch("emailCode") ? (errors.emailCode || !checkMail.check ? redLine : greenLine) : undefined} ${inputStyle} flex-grow`}
              placeholder="123456"
              {...register("emailCode", {
                required: "인증번호 확인은 필수 입력입니다.",
              })}
            />
            {!sendMail.send ? (
              <Button
                style="text-sm absolute top-1 right-1 bg-white"
                type="button"
              >
                번호 확인
              </Button>
            ) : (
              <Button
                style="text-sm absolute top-1 right-1 bg-white"
                type="button"
                onClick={checkNumMail}
              >
                확인 : {formatTime(checkCount)}
              </Button>
            )}
          </div>
          {errors.emailCode && (
            <small className="text-red-500">{errors.emailCode.message}</small>
          )}

          {!errors.emailCode && checkMail.check && (
            <small className="text-green-500">인증 확인 되었습니다.</small>
          )}

          {!errors.emailCode && !checkMail.check && (
            <small className="text-red-500">{checkMail.message}</small>
          )}

          <label htmlFor="age" className="cursor-pointer text-sm">
            생년월일
          </label>
          <input
            type="date"
            id="age"
            className={`${isSubmitted ? (errors.age ? redLine : greenLine) : undefined} ${inputStyle}`}
            {...register("age", {
              required: "생년월일은 필수 입력입니다.",
            })}
            value={birth}
            onChange={onBirthChange}
          />
          {errors.age && (
            <small className="text-red-500">{errors.age.message}</small>
          )}

          <label htmlFor="role" className="cursor-pointer text-sm">
            회원 선택
          </label>
          <select
            name="role"
            id="role"
            className={`cursor-pointe text-sm ${inputStyle}`}
            {...register("role")}
          >
            <option value="USER">손님</option>
            <option value="OWNER">점장님</option>
          </select>

          <div className="flex cursor-pointer gap-2 text-sm hover:text-blue-500 hover:underline">
            <input
              type="checkbox"
              name="agree"
              id="agree"
              onChange={(e) => setAgreeChecked(e.target.checked)}
            />
            <p onClick={() => setIsModalOpen(!isModalOpen)}>
              개인정보 활용 동의
            </p>
          </div>
          {!agreeChecked && isSubmitted && (
            <small className="text-red-500">
              개인정보 활용 동의 후 회원가입이 가능합니다.
            </small>
          )}

          <Button
            className={`${tomatoBtn} cursor-pointer disabled:opacity-50`}
            disabled={
              isSubmitting ||
              valNickname ||
              valId ||
              !sendMail.send ||
              !checkMail.check ||
              errors.nickname ||
              errors.id ||
              errors.password ||
              errors.passwordConfirm ||
              errors.email ||
              errors.emailCode ||
              errors.age ||
              watch("age") === "" ||
              !agreeChecked
            }
            onClick={signUp}
          >
            회원가입
          </Button>
        </form>
      </div>

      <Modal
        modalOpen={isModalOpen}
        setModalOpen={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) {
            setSelectedDate(today);
          }
        }}
        contentMotion={contentMotion}
        parentClass={
          "fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        }
        childClass={"relative bg-neutral-100 px-6 py-5 rounded-lg text-center"}
      >
        <p className="mb-3 font-bold">[개인정보 수집 및 이용 동의 안내]</p>
        <p className="h-[55vh] overflow-y-auto">
          이 웹사이트는 개인 포트폴리오 목적으로 제작된 사이트입니다. <br />
          페이지에 있는 모든 데이터는{" "}
          <span className="text-red-500">실제 정보가 아니며,</span> <br />
          <span className="text-red-500">임의로 생성된</span> 자료입니다. <br />
          개인정보 보호법에 의거하여 다음과 같은 내용을 고지합니다. <br />
          <br />
          <p className="font-bold">1. 개인정보 수집 목적</p>
          포트폴리오 기능 이용을 위한 최소한의 정보 수집.
          <br />
          <br />
          <p className="font-bold">2. 회원 가입 및 문의 응답을 위한 정보</p>
          사이트 사용성 분석을 위한 비식별 데이터 수집 <br />
          <br />
          <p className="font-bold">3. 수집 항목</p>
          이름, 이메일 주소 등 회원가입에 필요한 명시되어 있는 목록 <br />
          <br />
          <p className="font-bold">4. 수집 방법</p>
          회원 가입 시 사용자가 직접 입력 <br />
          <br />
          <p className="font-bold">5. 개인정보의 보유 및 이용 기간</p>
          수집일로부터 3년 동안 보관 후 자동 폐기됩니다. <br />
          사용자가 삭제를 요청할 경우 즉시 파기합니다. <br />
          <br />
          <p className="font-bold">6. 개인정보 최소 수집</p>
          개인정보 보호법에 따라 최소한의 개인정보만 수집하며, <br />
          이는 포트폴리오 기능 구현을 위한 필수적인 정보로 한정됩니다. <br />
          <br />
          <p className="font-bold">7. 정보 주체의 권리</p>
          사용자는 언제든지 자신의 개인정보에 대해 열람, 수정, 삭제를 요청할 수
          있으며, 동의를 거부할 권리가 있습니다. <br />
          동의하지 않을 경우 일부 서비스 이용이 제한될 수 있습니다. <br />
        </p>
      </Modal>
    </>
  );
}
