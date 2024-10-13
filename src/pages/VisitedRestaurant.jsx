import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import Button from "../components/Button";
import { inputStyle, tomatoBtn } from "../constants/style";
import Modal from "../components/Modal";

export default function VisitedRestaurant() {
    const [isLoading, setIsLoading] = useState(true);
    const [visitedInfo, setVisitedInfo] = useState([]);
    const [likedInfo, setLikedInfo] = useState([]);
    const [liked, setLiked] = useState({});
    const [star, setStar] = useState(5);
    const [createReviewContent, setcreateReviewContent] = useState('');
    const [myReview, setMyReview] = useState([]);
    const [reviewed, setReviewed] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [reviewMessage, setReviewMessage] = useState('');
    const [fadeOut, setFadeOut] = useState(false);

    const { accessToken } = useSelector((state) => state.authToken);
    const naviage = useNavigate();

    const foodTypeMap = {
        '한식': 'KOREAN',
        '중식': 'CHINESE',
        '일식': 'JAPANESE',
        '양식': 'WESTERN'
    };

    const toggleLike = async (restaurantId) => {
        const config = {
            headers: {
                Authorization: accessToken.token
            }
        }

        try {
            if (liked[restaurantId]) {
                await api.delete(`/restaurants/${restaurantId}/like`, config);
            } else {
                await api.post(`/restaurants/${restaurantId}/like`, null, config);
            }

            setLiked((prevLiked) => ({
                ...prevLiked,
                [restaurantId]: !prevLiked[restaurantId]
            }))

            getLikedRestaurant();
        } catch (err) {
            console.error(err);
        }
    }
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

    const createReview = async () => {
        const data = {
            rating: star,
            content: createReviewContent
        }
        const config = {
            headers: {
                Authorization: accessToken.token
            },
        }

        try {
            const res = await api.post(`/restaurants/${selectedRestaurantId}/reviews`, data, config);
            setIsModalOpen(false);
            setReviewMessage('등록되었습니다.')
            setShowSuccessMessage(true);

            setTimeout(() => {
                setFadeOut(true);
            }, 2000);

            setTimeout(() => {
                setShowSuccessMessage(false);
                setFadeOut(false);
            }, 3000);
            getMyReviews();
            getVisitedRestaurant();
        } catch (err) {
            console.error(err);
        }
    }

    const reviseReview = async (restaurantId, reviewId) => {
        const data = {
            preRating: reviewed[restaurantId].rating,
            rating: star,
            content: createReviewContent
        }

        const config = {
            headers: {
                Authorization: accessToken.token
            },
        }
        try {
            const res = await api.put(`/restaurants/${restaurantId}/reviews/${reviewId}`, data, config);

            setReviewMessage('수정되었습니다.')
            setShowSuccessMessage(true);

            setTimeout(() => {
                setFadeOut(true);
            }, 2000);

            setTimeout(() => {
                setShowSuccessMessage(false);
                setFadeOut(false);
            }, 3000);
            getMyReviews();
            getVisitedRestaurant();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    }

    const deleteReview = async (restaurantId, reviewId) => {
        const params = {
            rating: star,
        }

        const config = {
            headers: {
                Authorization: accessToken.token
            },
            params: params
        }
        try {
            const res = await api.delete(`/restaurants/${restaurantId}/reviews/${reviewId}`, config);

            setStar(5);
            setcreateReviewContent('');

            setReviewMessage('삭제되었습니다.')
            setShowSuccessMessage(true);

            setTimeout(() => {
                setFadeOut(true);
            }, 2000);

            setTimeout(() => {
                setShowSuccessMessage(false);
                setFadeOut(false);
            }, 3000);


            getMyReviews();
            getVisitedRestaurant();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    }

    const getLikedRestaurant = async () => {
        if (accessToken) {
            const config = {
                headers: {
                    Authorization: accessToken.token
                }
            }

            try {
                const res = await api.get('/users/like-restaurants', config);
                setLikedInfo(res.data);
                const likedRestaurants = {};
                res.data.forEach((restaurant) => {
                    likedRestaurants[restaurant.id] = true
                });
                setLiked(likedRestaurants);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        } else {
            naviage('/')
        }
    }


    const getMyReviews = async () => {
        const config = {
            headers: {
                Authorization: accessToken.token
            }
        }

        try {
            const res = await api.get('/users/reviews', config);
            setMyReview(res.data);
            // console.log(res.data)

            const reviewedRestaurants = {};
            res.data.forEach((restaurant) => {
                reviewedRestaurants[restaurant.restaurantId] = {
                    rating: restaurant.rating,
                    content: restaurant.content,
                    reviewId: restaurant.reviewId
                }
            })
            setReviewed(reviewedRestaurants);
        } catch (err) {
            console.error(err);
        }
    }
    const getVisitedRestaurant = async () => {
        if (accessToken) {
            const config = {
                headers: {
                    Authorization: accessToken.token
                }
            }

            try {
                const res = await api.get('/users/restaurants', config);
                setVisitedInfo(res.data);
            } catch (err) {
                console.error(err);
            }
        } else {
            alert('권한이 없습니다.');
            naviage('/')
        }
    }
    useEffect(() => {


        getVisitedRestaurant();
        getLikedRestaurant();
        getMyReviews();
    }, [accessToken, naviage]);

    const handleReviewChange = (e) => {
        setcreateReviewContent(e.target.value);
    }

    return (
        <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
            {isLoading ?
                <Loading /> :
                <>
                    <p className="font-bold mb-4">방문한 식당 목록</p>
                    <div className="overflow-y-auto h-96">
                        {visitedInfo.map((visited, index) => (
                            <div
                                className="flex cursor-pointer flex-col gap-1 px-6 py-8 shadow-lg sm:flex-row relative"
                                key={index}
                                onClick={() => naviage(`/restaurant/location/details/${visited.restaurantInfoDto.id}`)}
                            >
                                <div className="w-[300px] h-[196px]">
                                    <img src={visited.restaurantInfoDto.mainImage} className="rounded-lg" />
                                </div>
                                <div className="flex flex-col sm:ml-5 text-lg gap-1">
                                    <div className="flex items-center gap-1 font-bold">
                                        <span>{visited.restaurantInfoDto.name}</span>
                                        <span className="text-xs opacity-50">{foodTypeMap[visited.restaurantInfoDto.foodType]}</span>
                                    </div>
                                    <p className="text-xs">{visited.restaurantInfoDto.location}</p>
                                    <Rating rating={visited.restaurantInfoDto.rating} ratingNum={visited.restaurantInfoDto.ratingNum} />
                                    <span className="text-sm opacity-50">
                                        {visited.restaurantInfoDto.parking && (
                                            <span className="text-xs bg-neutral-200 opacity-75 p-1 rounded-lg">
                                                주차 가능
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-sm">
                                        방문 시간 : {visited.visitTime}
                                    </span>
                                    <div className="mt-2 z-20 sm:absolute sm:bottom-0 sm:right-0 sm:p-4">
                                        <div className="flex gap-3">
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleLike(visited.restaurantInfoDto.id);
                                                }}
                                            >
                                                {liked[visited.restaurantInfoDto.id] ?
                                                    <div className="bg-gray-500 text-white text-sm flex items-center gap-1 px-3 py-2 rounded-lg">
                                                        <span>🤍</span>
                                                        <span>좋아요 취소</span>
                                                    </div> :
                                                    <div className="bg-red-500 text-white text-sm flex items-center gap-1 px-3 py-2 rounded-lg">
                                                        <span>🤍</span>
                                                        <span>좋아요</span>
                                                    </div>
                                                }
                                            </div>
                                            {reviewed[visited.restaurantInfoDto.id] ?
                                                <div
                                                    className="bg-yellow-500 text-white text-sm flex items-center gap-1 px-3 py-2 rounded-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRestaurantId(visited.restaurantInfoDto.id);
                                                        setStar(reviewed[visited.restaurantInfoDto.id].rating);  // 기존 rating 값 설정
                                                        setcreateReviewContent(reviewed[visited.restaurantInfoDto.id].content);  // 기존 content 값 설정
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <span>★</span>
                                                    <span> 평점 수정</span>
                                                </div> :
                                                <div
                                                    className="bg-yellow-500 text-white text-sm flex items-center gap-1 px-3 py-2 rounded-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRestaurantId(visited.restaurantInfoDto.id);
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <span>★</span>
                                                    <span> 평점 입력</span>
                                                </div>
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="font-bold mt-10 mb-4">좋아요한 가게 목록</p>
                        <div className="h-[50vh] overflow-y-auto">
                            {likedInfo.map((liked) => (
                                <div
                                    key={liked.id}
                                    className="rounded-lg bg-neutral-100 p-5 shadow-lg mb-2 items-center"
                                >
                                    <div className="flex justify-between">
                                        <p>{liked.name}</p>
                                        <Button
                                            className={tomatoBtn}
                                            style={"text-sm"}
                                            onClick={() => naviage(`/restaurant/location/details/${liked.id}`)}
                                        >
                                            자세히 보기
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Modal
                        modalOpen={isModalOpen}
                        setModalOpen={setIsModalOpen}
                        parentClass={
                            "fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                        }
                        childClass={"relative bg-neutral-100 p-6 rounded-lg text-center"}
                        contentMotion={contentMotion}
                    >
                        <div className="flex justify-center">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="relative cursor-pointer"
                                    onClick={(e) => {
                                        const { left, width } = e.target.getBoundingClientRect();
                                        const clickPosition = e.clientX - left;
                                        const score = clickPosition < width / 2 ? index + 0.5 : index + 1;
                                        setStar(score);
                                    }}
                                >
                                    <span className={`text-4xl ${star >= index + 1 ? "text-yellow-500" : "text-gray-400"}`}>
                                        ★
                                    </span>
                                    {star === index + 0.5 && (
                                        <span
                                            className="absolute left-0 text-4xl text-yellow-500 overflow-hidden"
                                            style={{ width: "50%" }}
                                        >
                                            ★
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {reviewed[selectedRestaurantId] ?
                            <div>
                                <p className="mb-5">평점: {star}</p>
                                <div className="mb-3">
                                    <input type="text"
                                        className={`${inputStyle} h-24`}
                                        placeholder="리뷰를 남겨보세요!"
                                        value={createReviewContent}
                                        onChange={handleReviewChange}
                                    />
                                </div>
                                <span
                                    className="bg-yellow-400 text-white px-4 py-2 rounded-lg cursor-pointer text-sm mr-2"
                                    onClick={() => reviseReview(selectedRestaurantId, reviewed[selectedRestaurantId].reviewId)}
                                >
                                    수정하기
                                </span>
                                <span
                                    className="bg-red-400 text-white px-4 py-2 rounded-lg cursor-pointer text-sm"
                                    onClick={() => deleteReview(selectedRestaurantId, reviewed[selectedRestaurantId].reviewId)}
                                >
                                    삭제하기
                                </span>
                            </div>
                            :
                            <div>
                                <div className="mb-3">
                                    <p className="mb-5">평점: {star}</p>
                                    <input type="text"
                                        className={`${inputStyle} h-24`}
                                        placeholder="리뷰를 남겨보세요!"
                                        value={createReviewContent || ''}
                                        onChange={handleReviewChange}
                                    />
                                </div>
                                <span
                                    className="bg-yellow-400 text-white px-4 py-2 rounded-lg cursor-pointer text-sm"
                                    onClick={createReview}
                                >
                                    등록하기
                                </span>
                            </div>

                        }

                    </Modal>
                    {showSuccessMessage && (
                        <div
                            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg transition-opacity duration-1000 
                                ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
                        >
                            {reviewMessage}
                        </div>
                    )}
                </>

            }
        </div>
    )
}