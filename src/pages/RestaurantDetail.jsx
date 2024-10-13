import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import RestaurantSlider from "../components/slide/RestaurantSlider";
import Rating from "../components/Rating";
import LikeCount from "../components/LikeCount";
import { tomatoBtn } from "../constants/style";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Calendar from "../components/Calendar";
import SearchUserCount from "../components/search/SearchUserCount";
import { useSelector } from "react-redux";
import DraggableScroller from "../components/DraggableScroller";
import RestaurantMap from "../components/RestaurantMap.jsx";
import { Link } from "react-scroll";


export default function RegionDetail() {
  const { accessToken } = useSelector((state) => state.authToken);
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  const { restaurantId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [myMenu, setMyMenu] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [today, setToday] = useState(new Date().toLocaleDateString('en-CA'));
  const [selectedDate, setSelectedDate] = useState(today);
  const [reservationsTime, setReservationTime] = useState([]);
  const [myReservations, setMyReservations] = useState({});
  const [restaurantWaiting, setRestaurantwaiting] = useState(null);
  const [myWaiting, setMyWaiting] = useState(null);
  const [liked, setLiked] = useState([])
  const [userReviews, setUserReviews] = useState([]);


  const navigate = useNavigate();


  const foodTypeMap = {
    'KOREAN': '한식',
    'CHINESE': '중식',
    'JAPANESE': '일식',
    'WESTERN': '양식'
  }

  const convertTime = {
    'NINE_AM': '09:00',
    'TEN_AM': '10:00',
    'ELEVEN_AM': '11:00',
    'TWELVE_PM': '12:00',
    'ONE_PM': '13:00',
    'TWO_PM': '14:00',
    'THREE_PM': '15:00',
    'FOUR_PM': '16:00',
    'FIVE_PM': '17:00',
    'SIX_PM': '18:00',
    'SEVEN_PM': '19:00',
    'EIGHT_PM': '20:00',
  };

  const getUserReviews = async () => {
    try {
      const res = await api.get(`public/restaurants/${restaurantId}/reviews`);
      setUserReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  }



  const getMyWaiting = async () => {
    if (accessToken) {
      const config = {
        headers: {
          Authorization: accessToken.token
        }
      }
      try {
        const res = await api.get(`/restaurants/${restaurantId}/queue-reservations/me`, config);
        setMyWaiting(res.data.response);
      } catch (err) {
        if (err.response.status === 404) {
          setMyWaiting(0);
          getRestaurantWaiting();
        } else {
          console.error(err);
        }
      }
    }
  }

  const getRestaurantWaiting = async () => {
    try {
      const res = await api.get(`/public/restaurants/${restaurantId}/waiting`);
      setRestaurantwaiting(res.data.response);
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
        const likedRestaurants = {};
        res.data.forEach((restaurant) => {
          likedRestaurants[restaurant.id] = true
        });
        setLiked(likedRestaurants);
      } catch (err) {
        console.error(err);
      }
    }
  }

  const toggleLike = async (restaurantId) => {
    if (accessToken === null) {
      alert('로그인 후 진행해주세요.')
    }

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
      fetchRegionDetailRestaurant();

    } catch (err) {
      console.error(err);
    }
  }

  const fetchRegionDetailRestaurant = async () => {
    try {
      const res = await api.get(`/public/restaurants/${restaurantId}`);
      setRestaurantDetails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const getMyMenu = async () => {
      try {
        const res = await api.get(`/public/restaurants/${restaurantId}/menus`);
        setMyMenu(res.data.content);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegionDetailRestaurant();
    getUserReviews();
    getLikedRestaurant();
    getMyMenu();
    getMyWaiting();
    getRestaurantWaiting();
  }, [restaurantId]);

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

  const getTimeSlotReservations = async () => {
    try {
      const res = await api.get(`/public/restaurants/${restaurantId}/timeslot-reservations-full-check`, {
        params: { date: selectedDate }
      });
      setReservationTime(Object.entries(res.data));
    } catch (err) {
      console.error(err);
    }
  }

  const getMyReservations = async () => {
    const config = {
      headers: {
        Authorization: `${accessToken.token}`,
      },
    };

    const paramList = Object.keys(convertTime).map((timeKey) => ({
      date: selectedDate,
      'time-slot': timeKey,
    }));


    try {
      const reservationPromises = paramList.map((params) => (
        api.get(`/restaurants/${restaurantId}/timeslot-reservations-check`, { params, ...config })
      ));

      const results = await Promise.all(reservationPromises);
      const reservationResults = {};

      results.forEach((res, index) => {
        const timeKey = Object.keys(convertTime)[index];
        reservationResults[timeKey] = res.data.response;
      })

      setMyReservations(reservationResults);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReservationClick = () => {
    setIsModalOpen(true);
    getTimeSlotReservations();
    getMyReservations();
  }

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    getTimeSlotReservations();
    getMyReservations();
  }

  const requestReservation = async (time) => {
    if (accessToken === null) {
      alert("로그인 후 진행해주세요.");
      return;
    }

    const params = {
      'date': selectedDate,
      'time-slot': time,
    }

    const config = {
      headers: {
        Authorization: `${accessToken.token}`,
      },
      params: params
    }

    try {
      const res = await api.post(`/restaurants/${restaurantId}/timeslot-reservations`, null, config);
      getTimeSlotReservations();
      getMyReservations();
    } catch (err) {
      console.error(err);
    }
  }

  const cancelReservation = async (time) => {
    if (accessToken === null) {
      alert("로그인 후 진행해주세요.");
      return;
    }

    const params = {
      'date': selectedDate,
      'time-slot': time,
    }

    const config = {
      headers: {
        Authorization: `${accessToken.token}`,
      },
      params: params
    }

    try {
      const res = await api.delete(`/restaurants/${restaurantId}/timeslot-reservations`, config);
      alert(JSON.stringify(res.data.response));
      getTimeSlotReservations();
      getMyReservations();
    } catch (err) {
      console.error(err);
    }
  }

  const requestWaiting = async () => {
    if (accessToken === null) {
      alert("로그인 후 진행해주세요.");
      return;
    }

    const config = {
      headers: {
        Authorization: accessToken.token
      }
    }

    try {
      const res = await api.post(`/restaurants/${restaurantId}/queue-reservations`, null, config);
      alert(JSON.stringify(res.data.response));
      getMyWaiting();
      getRestaurantWaiting();
    } catch (err) {
      console.error(err);
    }
  }

  const cancelWaiting = async () => {
    const config = {
      headers: {
        Authorization: accessToken.token
      }
    }

    try {
      const res = await api.delete(`/restaurants/${restaurantId}/queue-reservations`, config);
      alert(JSON.stringify(res.data.response));
      setMyWaiting(null);
      getRestaurantWaiting();
    } catch (err) {
      console.error(err);
    }
  }

  const delayWaiting = async () => {
    const config = {
      headers: {
        Authorization: accessToken.token
      }
    }

    const data = {
      booking: restaurantWaiting
    }

    try {
      const res = await api.patch(`/restaurants/${restaurantId}/queue-reservations/postponed-guest-booking`, data, config);
      alert('성공적으로 대기 번호를 미뤘습니다.');
      getMyWaiting();
    } catch (err) {
      console.error(err);
    }
  }


  useEffect(() => {
    if (isModalOpen && selectedDate) {
      getTimeSlotReservations();
      getMyReservations();
    }
  }, [isModalOpen, selectedDate])

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      {isLoading ?
        <Loading /> :
        <>
          <div className="border-b mb-2">
            <RestaurantSlider mainImage={restaurantDetails.mainImage} subImages={restaurantDetails.subImages} />
            <div className="flex flex-col gap-1">
              <span className="text-sm opacity-50 mt-1">
                {foodTypeMap[restaurantDetails.foodType]}
              </span>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  {restaurantDetails.name}
                </span>
                <span
                  className="text-2xl sm:text-3xl cursor-pointer"
                  onClick={() => toggleLike(restaurantId)}
                >
                  {liked[restaurantId] ? "❤️" : "🤍"}
                </span>
              </div>


              <LikeCount likeCount={restaurantDetails.likeCount} />
              <div className="flex gap-1 items-center">
                <Rating rating={restaurantDetails.rating} ratingNum={restaurantDetails.ratingNum} />
                <Link
                  to="review"
                  smooth={true}
                  duration={1000}
                  offset={-50}
                >
                  <span className="cursor-pointer text-blue-500 hover:underline text-sm">
                    리뷰 보기
                  </span>
                </Link>
              </div>
              <div className="mt-2 flex flex-col text-sm gap-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined">
                    map
                  </span>
                  <div className="flex gap-1">
                    <span>
                      {restaurantDetails.location}
                    </span>
                    <Link
                      to="location"
                      smooth={true}
                      duration={1000}
                    >
                      <span className="cursor-pointer text-blue-500 hover:underline">
                        지도 보기
                      </span>
                    </Link>
                  </div>

                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined">
                    schedule
                  </span>
                  <span>
                    {restaurantDetails.time}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined">
                    call
                  </span>
                  <span>
                    {restaurantDetails.tel}
                  </span>
                </div>
              </div>
              <div className="text-sm text-ellipsis ">
                <p>{restaurantDetails.description}</p>
              </div>
              <div>
                {restaurantDetails.parking && (
                  <span className="text-xs bg-neutral-200 opacity-50 px-1 py-0.5 rounded-lg">
                    주차 가능
                  </span>
                )}
                <div className="flex justify-end p-2">
                  <div className="flex flex-col items-end">
                    <span>현재 테이블 / 총 테이블</span>
                    <span>{restaurantDetails.usedSeats} / {restaurantDetails.totalSeats}</span>
                  </div>
                </div>
                {accessToken ?
                  <div className="flex justify-end my-2 gap-2 text-xs sm:text-sm">
                    <Button
                      className={tomatoBtn}
                      onClick={handleReservationClick}
                    >
                      예약하기
                    </Button>
                    {restaurantDetails.usedSeats >= restaurantDetails.totalSeats && (
                      !myWaiting ?
                        <div className="flex">
                          <Button
                            className={tomatoBtn}
                            onClick={() => {
                              if (confirm('대기 번호 발급을 진행 하시겠습니까?')) {
                                requestWaiting();
                              }
                            }}
                            style={`disabled:opacity-40`}
                          >
                            대기 번호 발급 <br />
                            현재 대기 손님: {restaurantWaiting}
                          </Button>
                          <span
                            className="material-symbols-outlined cursor-pointer"
                            onClick={getRestaurantWaiting}
                          >
                            refresh
                          </span>
                        </div>
                        :
                        <div className="flex gap-3">
                          <Button
                            onClick={() => {
                              if (confirm('대기 번호 발급을 취소 하시겠습니까?')) {
                                cancelWaiting();
                              }
                            }}
                          >
                            대기 취소
                            <p>나의 대기 번호 : {myWaiting}</p>
                          </Button>
                          {myWaiting !== restaurantWaiting && (
                            <Button
                              onClick={() => {
                                if (confirm('대기 번호를 뒤로 미루겠습니까?')) {
                                  delayWaiting();
                                }
                              }}
                            >
                              미루기
                            </Button>
                          )}

                          <span
                            className="material-symbols-outlined cursor-pointer"
                            onClick={getMyWaiting}
                          >
                            refresh
                          </span>
                        </div>
                    )}
                  </div>

                  :
                  <div className="flex flex-col justify-end">
                    <Button
                      className={tomatoBtn}
                      onClick={() => navigate('/login')}
                    >
                      로그인 후 예약하기
                    </Button>
                  </div>
                }
                <p
                  className="text-sm text-gray-400 float-right mb-2">
                  테이블은 예약 우선순으로 진행 됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-2">
            <p className="sm:text-lg">메뉴</p>
            {myMenu.map((menu) => (
              <div key={menu.id} className="flex flex-col justify-between gap-3 border-b-2  sm:flex-row">
                <div className="w-full sm:w-[200px]">
                  <img src={menu.menuImage} className="rounded-lg object-cover h-60 w-full sm:h-44" />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="flex flex-col h-full justify-between sm:items-end sm:text-lg">
                    <p>{menu.name}</p>
                    <p>{menu.price}원</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-2">
            <p className="sm:text-lg" id="review">리뷰</p>
            <div className="bg-neutral-100 p-2 flex flex-col sm:flex-wrap sm:flex-row gap-3 rounded-lg max-h-[30vh] overflow-y-scroll">
              {userReviews.map((review) =>
                <div
                  key={review.reviewId}
                  className="bg-white p-2 rounded-lg shadow-sm h-[6rem]"
                >
                  <div className="mb-2 flex justify-between items-center">
                    {review.nickname}님
                    <span className="text-sm">
                      ⭐{review.rating}
                    </span>
                  </div>
                  <p>{review.content}</p>

                </div>
              )}
            </div>
          </div>

          <p className="sm:text-lg mb-2" id="location">위치</p>
          <RestaurantMap
            size={"w-full min-h-[60vh] rounded-lg"}
            latitude={restaurantDetails.latitude}
            longitude={restaurantDetails.longitude}
            name={restaurantDetails.name}
          />

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
            <div className="flex flex-col gap-3 text-sm">
              <Calendar onDateClick={handleDateClick} />
              {selectedDate ?
                <div className="flex justify-center gap-1 items-center">
                  선택 날짜 : {selectedDate}
                  <span
                    className="material-symbols-outlined cursor-pointer"
                    onClick={getTimeSlotReservations}
                  >
                    refresh
                  </span>
                </div> :
                <p>날짜를 선택해주세요.</p>
              }
              <SearchUserCount />
              <DraggableScroller className="flex gap-3 overflow-x-scroll w-72 md:w-[500px] lg:w-[600px]">
                {reservationsTime
                  .filter((time) => {
                    const openTime = restaurantDetails.time.split(' ~ ')[0];
                    const timeToCheck = convertTime[time[0]];
                    const currentTime = new Date().toTimeString().slice(0, 5);

                    if (today === selectedDate) {
                      return timeToCheck >= openTime && timeToCheck >= currentTime;
                    }

                    return timeToCheck >= openTime;
                  })
                  .map((time, index) => (
                    <div key={index} className="flex text-nowrap">
                      {myReservations[time[0]] ?
                        <Button
                          style={`disabled:opacity-40`}
                          onClick={() => {
                            if (confirm(`선택한 예약 시간은 "${convertTime[time[0]]}" 입니다. \n정말 취소하시겠습니까?`))
                              cancelReservation(time[0]);
                          }}
                        >
                          <div>
                            <p>{convertTime[time[0]]}</p>
                            취소
                          </div>
                        </Button> :

                        <Button
                          className={tomatoBtn}
                          style={`disabled:opacity-40`}
                          onClick={() => {
                            if (confirm(`선택한 예약 시간은 "${convertTime[time[0]]}" 입니다. \n예약을 진행하시겠습니까?`))
                              requestReservation(time[0]);
                          }}
                          disabled={time[1] >= Math.floor(restaurantDetails.totalSeats / 2)}
                        >
                          <div>
                            <p>{convertTime[time[0]]}</p>
                            <p>{time[1]} / {Math.floor(restaurantDetails.totalSeats / 2)}</p>
                          </div>
                        </Button>
                      }
                    </div>
                  ))
                }
              </DraggableScroller>
              <p className="text-sm text-gray-500">오후 9시부터 예약은 식당 전화로 부탁드립니다.</p>
            </div>
          </Modal>
        </>
      }
    </div >
  );
}