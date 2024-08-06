import { useForm } from "react-hook-form";
import { tomatoBtn, redLine, greenLine, inputStyle } from "../constants/style";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { api } from "../services/api";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isSubmitted, errors },
    trigger,
  } = useForm({ mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [valNickname, setValNickname] = useState(null);
  const [valId, setValId] = useState(null);
  const [sendMail, setSendMail] = useState({
    send: false,
    message: ''
  });
  const [checkMail, setCheckMail] = useState(false);
  const navigate = useNavigate();

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
      const res = await api.get('/public/users/check-username', {
        params: { username: id }
      });

      if (!res.data.response) {
        setValId(false);
      } else {
        setValId(true);
      }
    } catch (err) {
      setValId(true);
    }
  }

  const checkSendMail = async () => {
    try {
      const email = watch('email');
      const res = await api.post(`/public/emails/verification-request?email=${encodeURIComponent(email)}`);
      setSendMail((prevSendMail) => {
        return { ...prevSendMail, send: true }
      })
    } catch (err) {
      setSendMail((prevSendMail) => {
        return { ...prevSendMail, message: err.response.data.message }
      })
      console.error(err)
    }
  }



  // 개인정보 활용 동의 추가 필요
  useEffect(() => {
    if (isSubmitted) {
      trigger("passwordConfirm");
    }
  }, [watch("password"), trigger, isSubmitted]);

  return (
    <>
      <div className="grid h-[calc(100vh-10rem)] place-items-center py-2">
        <form
          className="relative flex w-full flex-col gap-2 px-4 sm:w-1/2 lg:w-1/3 xl:w-1/4"
          noValidate
          onSubmit={handleSubmit((data) => alert(data))}
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
                onChange: () => setValNickname(null)
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
              className={`${watch('id') ? (errors.id || valId === true || valId === null ? redLine : greenLine) : undefined} ${inputStyle} flex-grow`}
              maxLength="20"
              placeholder="특수문자를 제외한 4~20자"
              {...register("id", {
                required: "아이디는 필수 입력입니다.",
                pattern: {
                  value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]{4,20}$/,
                  message: "특수문자를 제외한 4~20자리여야 합니다.",
                },
                onChange: () => setValId(null)
              })}
            />
            <Button style="text-sm absolute top-1 right-1 bg-white disabled:opacity-40"
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
              className={`${watch('password') ? (errors.password ? redLine : greenLine) : undefined} ${inputStyle} flex-grow`}
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
              className={`${watch('email') ? (errors.email || !(sendMail.send) ? redLine : greenLine) : undefined} ${inputStyle} flex-grow truncate pr-24`}
              placeholder="tableforyou@table.com"
              {...register("email", {
                required: "이메일은 필수 입력입니다.",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "이메일 형식에 맞지 않습니다.",
                },
                onChange: () => setSendMail((prevSendMail) => {
                  return { ...prevSendMail, send: false }
                })
              })}
            />
            <Button style="text-sm absolute top-1 right-1 bg-white disabled:opacity-40"
              disabled={!watch("email") || errors.email}
              onClick={checkSendMail}
              type="button"
            >
              번호 전송
            </Button>
          </div>
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
          
         {/* {이메일 인증번호를 여러 번 보냈을 때 메시지가 변경 되어야 함} */}
          {!errors.email && sendMail.send === false && watch("email") && (
            <small className="text-red-500">이메일 인증을 진행해주세요.</small>
          )}

          {!errors.email && sendMail.send === false && sendMail.message !== '' && (
            <small className="text-red-500">{sendMail.message}</small>
          )}

          {!errors.email && sendMail.send === true && (
            <small className="text-green-500">인증 번호를 전송하였습니다.</small>
          )}

          <label htmlFor="email-validity" className="cursor-pointer text-sm">
            이메일 인증번호
          </label>
          <div className="relative flex">
            <input
              type="text"
              id="email-validity"
              className={`${isSubmitted ? (errors.emailValidity ? redLine : greenLine) : undefined} ${inputStyle} flex-grow`}
              placeholder="123456"
              {...register("emailValidity", {
                required: "인증번호 확인은 필수 입력입니다.",
              })}
            />
            <Button style="text-sm absolute top-1 right-1 bg-white">
              번호 확인
            </Button>
          </div>
          {errors.emailValidity && (
            <small className="text-red-500">
              {errors.emailValidity.message}
            </small>
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
          >
            <option value="customer">손님</option>
            <option value="store-manager">점장님</option>
          </select>

          <Button
            className={`${tomatoBtn} disabled:opacity-75`}
            onClick={() => navigate("/register")}
            disabled={isSubmitting}
          >
            회원가입
          </Button>
        </form>
      </div>
    </>
  );
}
