import { useForm } from "react-hook-form";
import Header from "../components/Header";
import Button from "../components/Button";
import { tomatoBtn } from "../constants/style"
import { useState } from "react";

export default function Register() {
    const { register, handleSubmit, formState: { isSubmitting, isSubmitted, errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    // 개인정보 활용 동의 추가 필요
    return (
        <>
            <Header />
            <div className="grid place-items-center h-[calc(100vh-10rem)]">
                <form className="flex flex-col gap-2 w-full px-4 relative sm:w-1/2 lg:w-1/3 xl:w-1/4" onSubmit={handleSubmit((data) => alert(data))}>

                    <label htmlFor="nickname" className="text-sm cursor-pointer">닉네임</label>
                    <div className="flex relative">
                        <input type="text" id="nickname" className="border-1 px-2 py-2 rounded-lg bg-neutral-100 flex-grow" maxLength="10" placeholder="특수문자를 제외한 2~10자" />
                        <Button btnName={'중복 확인'} style="text-sm absolute top-1 right-1 bg-white"></Button>
                    </div>

                    <label htmlFor="id" className="text-sm cursor-pointer">아이디</label>
                    <div className="flex relative">
                        <input type="text" id="id" className="border-1 px-2 py-2 rounded-lg bg-neutral-100 flex-grow" maxLength="20" placeholder="특수문자를 제외한 4~20자" />
                        <Button btnName={'중복 확인'} style="text-sm absolute top-1 right-1 bg-white"></Button>
                    </div>

                    <label htmlFor="password" className="text-sm cursor-pointer">비밀번호</label>
                    <input type="password" id="password" className="border-1 px-2 py-2 rounded-lg bg-neutral-100" maxLength="16" placeholder="숫자, 특수문자 포함 8~16자" />

                    <label htmlFor="password" className="text-sm cursor-pointer">비밀번호 2차확인</label>
                    <input type="password" id="password" className="border-1 px-2 py-2 rounded-lg bg-neutral-100" maxLength="16" placeholder="********" />

                    <label htmlFor="email" className="text-sm cursor-pointer">이메일</label>
                    <div className="flex relative">
                        <input type="email" id="email" className="border-1 px-2 py-2 rounded-lg bg-neutral-100 flex-grow pr-24 truncate" placeholder="tableforyou@table.com" />
                        <Button btnName={'번호 전송'} style="text-sm absolute top-1 right-1 bg-white"></Button>
                    </div>

                    <label htmlFor="email-validity" className="text-sm cursor-pointer">이메일 인증번호</label>
                    <div className="flex relative">
                        <input type="text" id="email-validity" className="border-1 px-2 py-2 rounded-lg bg-neutral-100 flex-grow" />
                        <Button btnName={'번호 확인'} style="text-sm absolute top-1 right-1 bg-white"></Button>
                    </div>  

                    <label htmlFor="age" className="text-sm cursor-pointer">생년월일</label>
                    <input type="date" id="age" className="border-1 px-2 py-2 rounded-lg bg-neutral-100"/>

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