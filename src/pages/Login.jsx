import { useForm } from "react-hook-form";
import Header from "../components/Header";
import { tomatoBtn } from "../constants/style"


export default function Login() {
    const { register, handleSubmit, formState: { isSubmitting, isSubmitted, errors } } = useForm()

    return (
        <>
            <Header />
            <div className="grid place-items-center h-[calc(100vh-20rem)]">
                <form className="flex flex-col gap-2 w-1/4 px-4" onSubmit={handleSubmit((data) => alert(JSON.stringify(data)))}>
                    <label className="text-sm cursor-pointer" htmlFor="id">아이디</label>
                    <input
                        className="border-1 px-2 py-3 rounded-lg bg-neutral-100 "
                        id="id"
                        type="text"
                        placeholder="TableForYou"
                        {...register("id", {
                            required: "아이디는 필수 입력입니다."
                        })}
                    />
                    {errors.id && <small className="text-red-500">{errors.id.message}</small>}
                    <label className="text-sm cursor-pointer" htmlFor="password">비밀번호</label>
                    <input
                        className="border-1 px-2 py-3 rounded-lg bg-neutral-100"
                        id="password"
                        type="password"
                        placeholder="********"
                        {...register("password", {
                            required: "비밀번호는 필수 입력입니다."
                        })}
                    />
                    {errors.password && <small className="text-red-500">{errors.password.message}</small>}
                    <button
                        className={tomatoBtn}
                        disabled={isSubmitting}>
                        로그인
                    </button>
                    <div className="flex justify-end">
                        <small>비밀번호 재설정</small>
                    </div>
                    <p className="text-sm text-zinc-500 m-auto">계정이 없으신가요?</p>
                    <button>회원가입</button>
                </form>
            </div>
        </>
    )
}