import { useEffect, useState } from "react"
import Button from "../../components/Button"
import { useSelector } from "react-redux"
import { decodeToken } from "../../utils/decodeToken";
import { api } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useForm } from "react-hook-form";
import ImageUploader from "../../components/slide/ImageUploader";
import { inputStyle, tomatoBtn } from "../../constants/style";

export default function MenuManage() {
    const { accessToken } = useSelector((state) => state.authToken);
    const { restaurantId } = useParams();
    const [myMenu, setMyMenu] = useState([]);
    const [menuPrice, setMenuPrice] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [menuImage, setMenuImage] = useState([null]);
    const navigate = useNavigate();

    const {
        register,
        watch,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitted },
    } = useForm();

    const getMyMenu = async () => {
        if (accessToken) {
            const decoded = decodeToken(JSON.stringify(accessToken));
            if (decoded.role === "OWNER") {
                const config = {
                    headers: {
                        Authorization: `${accessToken.token}`,
                    }
                }

                try {
                    const res = await api.get(`/public/restaurants/${restaurantId}/menus`, config);
                    setMyMenu(res.data.content);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            {
                alert('권한이 없습니다.');
                navigate('/');
            }
        }
    };

    useEffect(() => {
        getMyMenu();
    }, [accessToken, navigate]);

    const priceChangeHandler = (event) => {
        let price = event.target.value;

        price = price.replace(/[^0-9]/g, '');

        if (price) {
            setMenuPrice(Number(price).toLocaleString('ko-KR'));
        } else {
            setMenuPrice('');
        }
    };

    const onSubmit = async () => {
        const formData = new FormData();
        const data = {
            name: watch('menuName'),
            price: watch('menuPrice')
        }

        if (menuImage[0]) {
            formData.append('menuImage', menuImage[0].file);
        }

        formData.append('menuDto', new Blob([JSON.stringify(data)], { type: 'application/json' }));

        const config = {
            headers: {
                // "Content-Type": "multipart/form-data",
                Authorization: `${accessToken.token}`,
            },
        };

        try {
            const res = await api.post(`/restaurants/${restaurantId}/menus`, formData, config);
            if (res.status === 200) {
                alert('메뉴가 정상적으로 등록되었습니다.');
            }
            getMyMenu();
            console.log(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    const deleteMenu = async (menuId) => {
        const config = {
            headers: {
                Authorization: `${accessToken.token}`
            }
        }

        try {
            const res = await api.delete(`/restaurants/${restaurantId}/menus/${menuId}`, config);
            alert(JSON.stringify(res.data.response));
            getMyMenu();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
            {isLoading ?
                <Loading /> :
                <div>
                    {myMenu.length > 0 ?
                        <div>
                            <p className="text-lg">등록된 메뉴 목록</p>
                            <div className=" bg-neutral-100 flex flex-col gap-3 h-[50vh] overflow-y-scroll">
                                {myMenu.map((menu) => (
                                    <div key={menu.id} className="flex flex-col gap-3 border-b-2 p-2 sm:flex-row">
                                        <div className="w-full sm:w-[200px]">
                                            <img src={menu.menuImage} className="rounded-lg object-cover h-60 w-full sm:h-44" />
                                        </div>
                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <p>메뉴명 : {menu.name}</p>
                                                <p>가격 : {menu.price}</p>
                                            </div>
                                            <div className="text-sm flex gap-2 mt-2">
                                                <Button
                                                    className={tomatoBtn}
                                                    style={`p-2`}
                                                    onClick={() => navigate(`update/${menu.id}`)}
                                                >
                                                    메뉴 수정
                                                </Button>
                                                <Button onClick={() => deleteMenu(menu.id)}>메뉴 삭제</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> :
                        <div className="flex items-center justify-center h-[60vh] text-lg">
                            <p>등록된 메뉴가 없습니다.</p>
                        </div>
                    }
                    <div className="flex flex-col gap-3">
                        <p className="text-lg mt-2">메뉴 만들기</p>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <label htmlFor="menuImage">메뉴 사진</label>
                            <ImageUploader
                                images={menuImage}
                                setImages={(newImages) => {
                                    setMenuImage((newImages));
                                    if (newImages.some((img) => img === null)) {
                                        setError('menuImage');
                                    } else {
                                        clearErrors('menuImage');
                                    }
                                }}
                            />
                            {isSubmitted && menuImage.some((img) => img === null) && (
                                <small className="text-red-500">
                                    메뉴 사진을 등록해주세요.
                                </small>
                            )}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="menu-name">메뉴명</label>
                                <input
                                    type="text"
                                    className={`${inputStyle}`}
                                    placeholder="햄버거"
                                    id="menuName"
                                    {...register('menuName', {
                                        required: '메뉴명을 입력해주세요.'
                                    })}
                                />
                            </div>
                            {isSubmitted && errors.menuName && (
                                <small className="text-red-500">{errors.menuName.message}</small>
                            )}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="menu-price">가격</label>
                                <input
                                    type="text"
                                    className={`${inputStyle}`}
                                    placeholder="6000"
                                    id="menuPrice"
                                    {...register('menuPrice', {
                                        required: '가격을 입력해주세요.'
                                    })}
                                    value={menuPrice}
                                    onChange={priceChangeHandler}
                                />
                            </div>
                            {isSubmitted && errors.menuPrice && (
                                <small className="text-red-500">{errors.menuPrice.message}</small>
                            )}
                            <Button className={tomatoBtn} style={'w-full'}>
                                추가하기
                            </Button>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}