import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useSelector } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import Loading from "../../components/Loading";

export default function UserDetails() {
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { accessToken } = useSelector((state) => state.authToken);
    const { userId } = useParams();
    const navigate = useNavigate();


    const getUserDetail = async () => {
        if (accessToken) {
            const decoded = decodeToken(JSON.stringify(accessToken));
            if (decoded.role === "ADMIN") {
                const config = {
                    headers: {
                        Authorization: accessToken.token
                    }
                }
                try {
                    const res = await api.get(`/admin/users/${userId}`, config);
                    setUser(res.data);
                    console.log(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            alert('권한이 없습니다.');
            navigate('/');
        }
    }

    useEffect(() => {
        getUserDetail();
    }, [accessToken, userId]);

    return (
        <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
            {isLoading ?
                <Loading /> :
                <div className="bg-neutral-100 shadow-lg p-4 flex flex-col gap-3">
                    <p>유저 고유 번호 : {user.id}</p>
                    <p>아이디 : {user.username}</p>
                    <p>역할 : {user.role}</p>
                    <p>닉네임 : {user.nickname}</p>
                    <p>이메일 : {user.email}</p>
                    <p>나이 : {user.age}</p>
                    <p>가입 일자 : {user.createdTime}</p>
                </div>
            }
        </div>
    )
}