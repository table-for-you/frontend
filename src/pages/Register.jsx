import { useForm } from "react-hook-form";
import Header from "../components/Header";
import Button from "../components/Button";
import { tomatoBtn } from "../constants/style"
import { useState, useEffect } from "react";

export default function Register() {
    const { register, handleSubmit, watch, formState: { isSubmitting, isSubmitted, errors }, trigger } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    // 개인정보 활용 동의 추가 필요

    useEffect(() => {
        if (isSubmitted) {
            trigger("passwordConfirm");
        }

    }, [watch("password"), trigger, isSubmitted])

    return (
        <>
            <Header />
            <div className="grid place-items-center h-[calc(100vh-10rem)] py-2">
                <form className="flex flex-col gap-2 w-full px-4 relative sm:w-1/2 lg:w-1/3 xl:w-1/4" noValidate onSubmit={handleSubmit((data) => alert(data))}>

                    <label htmlFor="nickname" className="text-sm cursor-pointer">닉네임</label>
                    <div className="flex relative">
                        <input
                            type="text"
                            id="nickname"
                            className={`${isSubmitted ? (errors.nickname ? "focus:outline-none ring-1 ring-red-500" : "focus:outline-none ring-1 ring-green-500") : undefined} border-1 px-2 py-2 rounded-lg bg-neutral-100 flex-grow`}
                            maxLength="10"
                            placeholder="특수문자를 제외한 2~10자"
                            {...register("nickname", {
                                required: "닉네임은 필수 입력입니다.",
                                pattern: {
                                    value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]{2,10}$/,
                                    message: "특수문자를 제외한 2~10자리여야 합니다."
                                }
                            })}
                        />
                        <Button btnName={'중복 확인'} style="text-sm absolute top-1 right-1 bg-white"></Button>
                    </div>
                    {errors.nickname && <small className="text-red-500">{errors.nickname.message}</small>}


                    <label htmlFor="id" className="text-sm cursor-pointer">아이디</label>
                    <div className="flex relative">
                        <input
                            type="text"
                            id="id"
                            className={`${isSubmitted ? (errors.id ? "focus:outline-none ring-1 ring-red-500" : "focus:outline-none ring-1 ring-green-500") : undefined} border-1 px-2 py-2 rounded-lg bg-neutral-100 flex-grow`}
                            maxLength="20"
                            placeholder="특수문자를 제외한 4~20자"
                            {...register("id", {
                                required: "아이디는 필수 입력입니다.",
                                pattern: {
                                    value: /^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]{4,20}$/,
                                    message: "특수문자를 제외한 4~20자리여야 합니다."
                                }
                            })}
                        />
                        <Button btnName={'중복 확인'} style="text-sm absolute top-1 right-1 bg-white"></Button>
                    </div>
                    {errors.id && <small className="text-red-500">{errors.id.message}</small>}

                    <label htmlFor="password" className="text-sm cursor-pointer">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        className={`${isSubmitted ? (errors.password ? "focus:outline-none ring-1 ring-red-500" : "focus:outline-none ring-1 ring-green-500") : undefined} border-1 px-2 py-2 rounded-lg bg-neutral-100`}
                        maxLength="16"
                        placeholder="숫자, 특수문자 포함 8~16자"
                        {...register("password", {
                            required: "비밀번호는 필수 입력입니다.",
                            pattern: {
                                value: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W).{8,16}/,
                                message: "숫자, 특수문자 포함 8~16자리여야 합니다."
                            }
                        })}
                    />
                    {errors.password && <small className="text-red-500">{errors.password.message}</small>}


                    <label htmlFor="password" className="text-sm cursor-pointer">비밀번호 2차 확인</label>
                    <input
                        type="password"
                        id="password"
                        className={`${isSubmitted ? (errors.passwordConfirm ? "focus:outline-none ring-1 ring-red-500" : "focus:outline-none ring-1 ring-green-500") : undefined} border-1 px-2 py-2 rounded-lg bg-neutral-100`}
                        maxLength="16"
                        placeholder="********"
                        {...register("passwordConfirm", {
                            required: "2차 확인은 필수 입력입니다.",
                            validate: value => value === watch("password") || "비밀번호가 일치하지 않습니다."
                        })}
                    />
                    {errors.passwordConfirm && <small className="text-red-500">{errors.passwordConfirm.message}</small>}


                    <label htmlFor="email" className="text-sm cursor-pointer">이메일</label>
                    <div className="flex relative">
                        <input
                            type="email"
                            id="email"
                            className={`${isSubmitted ? (errors.email ? "focus:outline-none ring-1 ring-red-500" : "focus:outline-none ring-1 ring-green-500") : undefined} border-1 px-2 py-2 rounded-lg bg-neutral-100 flex-grow pr-24 truncate`}
                            placeholder="tableforyou@table.com"
                            {...register("email", {
                                required: "이메일은 필수 입력입니다.",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "이메일 형식에 맞지 않습니다."
                                }
                            })}
                        />
                        <Button btnName={'번호 전송'} style="text-sm absolute top-1 right-1 bg-white"></Button>
                    </div>
                    {errors.email && <small className="text-red-500">{errors.email.message}</small>}

                    <label htmlFor="email-validity" className="text-sm cursor-pointer">이메일 인증번호</label>
                    <div className="flex relative">
                        <input
                            type="text"
                            id="email-validity"
                            className={`${isSubmitted ? (errors.emailValidity ? "focus:outline-none ring-1 ring-red-500" : "focus:outline-none ring-1 ring-green-500") : undefined} border-1 px-2 py-2 rounded-lg bg-neutral-100 flex-grow`}
                            {...register('emailValidity', {
                                required: '인증번호 확인은 필수 입력입니다.'
                            })}
                        />
                        <Button btnName={'번호 확인'} style="text-sm absolute top-1 right-1 bg-white"></Button>
                    </div>
                    {errors.emailValidity && <small className="text-red-500">{errors.emailValidity.message}</small>}

                    <label htmlFor="age" className="text-sm cursor-pointer">생년월일</label>
                    <input
                        type="date"
                        id="age"
                        className={`${isSubmitted ? (errors.age ? "focus:outline-none ring-1 ring-red-500" : "focus:outline-none ring-1 ring-green-500") : undefined} border-1 px-2 py-2 rounded-lg bg-neutral-100`}
                        {...register("age", {
                            required: '생년월일은 필수 입력입니다.'
                        })}
                    />
                    {errors.age && <small className="text-red-500">{errors.age.message}</small>}

                    <label htmlFor="role" className="text-sm cursor-pointer">회원 선택</label>
                    <select name="role" id="role" className="text-sm cursor-pointe border-1 px-2 py-3 rounded-lg bg-neutral-100">
                        <option value="customer">손님</option>
                        <option value="store-manager">점장님</option>
                    </select>

                    <Button
                        className={`${tomatoBtn} disabled:opacity-75`}
                        btnName={'회원가입'}
                        disabled={isSubmitting}>
                    </Button>
                </form>
            </div>
        </>
    )
}