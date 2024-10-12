import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useSelector } from "react-redux";
import { decodeToken } from "../utils/decodeToken";
import Button from "../components/Button";
import { inputStyle, tomatoBtn } from "../constants/style";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [myInfo, setMyInfo] = useState({});
    const { accessToken } = useSelector((state) => state.authToken);
    const navigate = useNavigate();

    useEffect(() => {
        const getMyInfo = async () => {
            const config = {
                headers: {
                    Authorization: accessToken.token
                }
            }

            try {
                const res = await api.get(`/users`, config);
                setMyInfo(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }

        }

        getMyInfo();
    }, [accessToken]);

    const withdraw = async () => {
        const config = {
            headers: {
                Authorization: accessToken.token
            }
        }
        try {
            const res = await api.delete('/users', config);
            alert('정상적으로 회원 탈퇴하였습니다. \n이용해주셔서 감사합니다.')
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
            {isLoading ?
                <Loading /> :
                <div>
                    <div className="flex flex-col gap-4">
                        <p className="font-bold">나의 정보</p>
                        <div className="bg-neutral-100 shadow-lg p-4 flex flex-col gap-3">
                            <p>유저 고유 번호 : {myInfo.id}</p>
                            <p>유저명 : {myInfo.username}</p>
                            <p>역할 : {myInfo.role}</p>
                            <p>닉네임 : {myInfo.nickname}</p>
                            <p>이메일 : {myInfo.email}</p>
                            <p>나이 : {myInfo.age}</p>
                            <p>가입 일자 : {myInfo.createdTime}</p>
                        </div>

                        {/* <div>
                            <p className="font-bold mb-2">정보 수정</p>
                            <form className="bg-neutral-100 shadow-lg p-4 flex flex-col gap-3">
                                <label htmlFor="nickname">닉네임</label>
                                <input type="text" className={inputStyle} />
                                <label htmlFor="password">패스워드</label>
                                <input type="password" className={inputStyle} />
                                <label htmlFor="age">나이</label>
                            </form>
                        </div> */}
                    </div>
                    <Button
                        className={tomatoBtn}
                        style={`float-right mt-4`}
                        onClick={() => {
                            if (confirm('정말로 회원 탈퇴하시겠습니까?')) {
                                withdraw();
                            }
                        }}
                    >
                        탈퇴하기
                    </Button>
                </div>
            }
        </div>
    )
}
