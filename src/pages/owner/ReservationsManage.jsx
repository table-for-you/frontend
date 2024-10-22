import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { tomatoBtn } from "../../constants/style";
import Button from "../../components/Button";
import Calendar from "../../components/Calendar";
import { useSelector } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import Loading from "../../components/Loading";

export default function ReservationsManage() {
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const { restaurantId } = useParams();
  const { accessToken } = useSelector((state) => state.authToken);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );
  const [reservations, setReservations] = useState([]);
  const [userWaiting, setUserWaiting] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const convertTime = {
    NINE_AM: "09:00",
    TEN_AM: "10:00",
    ELEVEN_AM: "11:00",
    TWELVE_PM: "12:00",
    ONE_PM: "13:00",
    TWO_PM: "14:00",
    THREE_PM: "15:00",
    FOUR_PM: "16:00",
    FIVE_PM: "17:00",
    SIX_PM: "18:00",
    SEVEN_PM: "19:00",
    EIGHT_PM: "20:00",
  };

  const getMyRestaurant = async () => {
    const decoded = decodeToken(JSON.stringify(accessToken));

    if (accessToken) {
      if (decoded.role === "OWNER") {
        try {
          const res = await api.get(`/public/restaurants/${restaurantId}`);
          setRestaurantInfo(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      alert("권한이 없습니다.");
      navigate("/");
    }
  };

  const getTimeSlotUserReservations = async () => {
    const config = {
      headers: {
        Authorization: accessToken.token,
      },
    };

    const paramList = Object.keys(convertTime).map((timeKey) => ({
      date: selectedDate,
      "time-slot": timeKey,
    }));

    try {
      const reservationPromises = paramList.map((params) =>
        api.get(`/owner/restaurants/${restaurantId}/timeslot-reservations`, {
          params,
          ...config,
        }),
      );

      const results = await Promise.all(reservationPromises);
      const reservationResults = [];

      results.forEach((res, index) => {
        const timeKey = Object.keys(convertTime)[index];
        reservationResults[timeKey] = res.data;
      });
      setReservations(reservationResults);
    } catch (err) {
      console.error(err);
    }
  };

  const getUserWaiting = async () => {
    const config = {
      headers: {
        Authorization: accessToken.token,
      },
    };
    console.log("test");
    try {
      const res = await api.get(
        `/owner/restaurants/${restaurantId}/queue-reservations`,
        config,
      );
      setUserWaiting(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMyRestaurant();
    getUserWaiting();
  }, [restaurantId, accessToken]);

  const handleUsedSeats = async (increase) => {
    const params = {
      increase: increase,
    };

    const config = {
      headers: {
        Authorization: accessToken.token,
      },
      params: params,
    };

    try {
      const res = await api.patch(
        `/owner/restaurants/${restaurantId}/update-used-seats`,
        null,
        config,
      );
      getMyRestaurant();
      getUserWaiting();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const cancelUserReservation = async (time, username) => {
    const params = {
      date: selectedDate,
      "time-slot": time,
    };

    const config = {
      headers: {
        Authorization: accessToken.token,
      },
      params: params,
    };

    try {
      const res = await api.delete(
        `/owner/restaurants/${restaurantId}/timeslot-reservations/${username}`,
        config,
      );
      alert(JSON.stringify(res.data.response));
      getTimeSlotUserReservations();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelUserWaiting = async (username) => {
    const config = {
      headers: {
        Authorization: accessToken.token,
      },
    };

    try {
      const res = await api.delete(
        `/owner/restaurants/${restaurantId}/queue-reservations/${username}`,
        config,
      );
      alert(JSON.stringify(res.data.response));
      getUserWaiting();
    } catch (err) {
      console.error(err);
    }
  };

  const delayUserWaiting = async (username) => {
    const config = {
      headers: {
        Authorization: accessToken.token,
      },
    };

    const data = {
      booking: userWaiting.length,
    };

    try {
      const res = await api.patch(
        `/owner/restaurants/${restaurantId}/queue-reservations/postponed-guest-booking/${username}`,
        data,
        config,
      );
      alert(JSON.stringify(`${username} 손님 미루기 완료`));
      getUserWaiting();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      getTimeSlotUserReservations();
    }
  }, [selectedDate]);

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className="mb-3 text-lg">
            "{restaurantInfo.name}" 예약 / 테이블 관리
          </p>
          <div className="flex flex-col gap-4">
            <p className="text-sm">
              점주님 반갑습니다 ! <br />
              손님들의 시간대 예약과 <br />
              현재 이용중인 오프라인 손님분들을 감안하여 <br />
              테이블을 관리해주시길 바랍니다.
            </p>

            <p className="text-lg">테이블 업데이트</p>
            <div className="bg-neutral-100 p-3 shadow-lg">
              <p className="mb-2">현재 이용 테이블 수 / 총 테이블 수</p>
              <div className="flex items-center gap-2">
                {restaurantInfo.usedSeats <= 1 ? (
                  <span className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 opacity-50">
                    remove
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 hover:bg-gray-100 active:bg-gray-200"
                    onClick={() => handleUsedSeats(false)}
                  >
                    remove
                  </span>
                )}
                <span className="p-1 text-xl font-bold">
                  {restaurantInfo.usedSeats} / {restaurantInfo.totalSeats}
                </span>
                {restaurantInfo.usedSeats >= restaurantInfo.totalSeats ? (
                  <span className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 opacity-50">
                    add
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined ounded-full cursor-pointer rounded-full border-2 p-1 hover:bg-gray-100 active:bg-gray-200"
                    onClick={() => handleUsedSeats(true)}
                  >
                    add
                  </span>
                )}
              </div>
            </div>
            <p className="text-lg">예약자 목록 &#40;날짜별 / 대기번호&#41;</p>
            <div className="border-b-[1px]">
              <p className="text-lg">날짜별</p>
              <div className="mb-3 text-xs">
                <Calendar onDateClick={handleDateClick} />
              </div>

              <div className="mb-2 flex items-end justify-between">
                <p>{selectedDate}</p>
                <span
                  className="material-symbols-outlined cursor-pointer"
                  onClick={getUserWaiting}
                >
                  refresh
                </span>
              </div>
              {Object.entries(reservations)
                .filter(
                  ([timeKey, reservationList]) => reservationList.length > 0,
                )
                .map(([timeKey, reservationList]) => (
                  <div key={timeKey} className="border-b-[1px] py-2">
                    <p>
                      {convertTime[timeKey]} {reservationList.length}명
                    </p>
                    {reservationList.map((reservation, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <p key={index}>
                          {index + 1}. {reservation.username}
                        </p>
                        <Button
                          className={tomatoBtn}
                          style={"text-sm"}
                          onClick={() =>
                            cancelUserReservation(timeKey, reservation.username)
                          }
                        >
                          예약 취소
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
            <div>
              <p className="text-lg">현재 대기 번호자 {userWaiting.length}명</p>
              {userWaiting
                .sort((a, b) => a.booking - b.booking)
                .map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <p>
                      {user.booking}. {user.username}
                    </p>
                    <div>
                      {user.booking !== userWaiting.length && (
                        <Button
                          className={tomatoBtn}
                          style={"text-sm"}
                          onClick={() => delayUserWaiting(user.username)}
                        >
                          예약 지연
                        </Button>
                      )}
                      <Button
                        className={tomatoBtn}
                        style={"text-sm"}
                        onClick={() => cancelUserWaiting(user.username)}
                      >
                        예약 취소
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
