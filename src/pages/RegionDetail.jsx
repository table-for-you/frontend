import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import RestaurantSlider from "../components/slide/RestaurantSlider";
import Rating from "../components/Rating";
import LikeCount from "../components/LikeCount";
import { tomatoBtn } from "../constants/style";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Calendar from "../components/Calendar";
import SearchUserCount from "../components/search/SearchUserCount";

export default function RegionDetail() {
  const [restaurantDetails, setRestaurantDetails] = useState([]);
  const { restaurantId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [myMenu, setMyMenu] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const foodTypeMap = {
    'KOREAN': '한식',
    'CHINESE': '중식',
    'JAPANESE': '일식',
    'WESTERN': '양식'
  }

  const reservationTime = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ]

  useEffect(() => {
    const fetchRegionDetailRestaurant = async () => {
      try {
        const res = await api.get(`/public/restaurants/${restaurantId}`);
        setRestaurantDetails(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const getMyMenu = async () => {
      try {
        const res = await api.get(`/public/restaurants/${restaurantId}/menus`);
        setMyMenu(res.data.content);
      } catch (err) {
        console.error(err);
      }
    };


    fetchRegionDetailRestaurant();
    getMyMenu();
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

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      {isLoading ?
        <Loading /> :
        <>
          <div className="border-b mb-2">
            <RestaurantSlider mainImage={restaurantDetails.mainImage} subImages={restaurantDetails.subImages} />
            <div className="flex flex-col gap-1">
              <span className="text-sm opacity-50">
                {foodTypeMap[restaurantDetails.foodType]}
              </span>
              <span className="text-lg font-bold">
                {restaurantDetails.name}
              </span>
              <LikeCount likeCount={restaurantDetails.likeCount} />
              <Rating rating={restaurantDetails.rating} />
              <div className="mt-2 flex flex-col text-sm gap-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined">
                    map
                  </span>
                  <span>
                    {restaurantDetails.location}
                  </span>
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
                <Button
                  className={tomatoBtn}
                  style={`p-2 mt-6 mb-2 float-right`}
                  onClick={() => setIsModalOpen(true)}
                >
                  예약하기
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-lg">메뉴</p>
            {myMenu.map((menu) => (
              <div key={menu.id} className="flex flex-col justify-between gap-3 border-b-2 p-2 sm:flex-row">
                <div className="w-full sm:w-[200px]">
                  <img src={menu.menuImage} className="rounded-lg object-cover h-60 w-full sm:h-44" />
                </div>
                <div className="flex flex-col justify-between">
                  <div className="text-lg flex flex-col justify-between h-full sm:items-end">
                    <p >{menu.name}</p>
                    <p>{menu.price}원</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Modal
            modalOpen={isModalOpen}
            setModalOpen={setIsModalOpen}
            contentMotion={contentMotion}
            parentClass={
              "fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            }
            childClass={"relative bg-neutral-100 px-6 py-5 rounded-lg text-center"}
          >
            <div className="flex flex-col gap-3 text-sm">
              <Calendar />
              <SearchUserCount />
              <div className="flex gap-3 w-72 overflow-x-scroll">
                {reservationTime.map((time, index) => (
                  <div key={index}>
                    <Button className={tomatoBtn} style={'p-2 text-nowrap select-none'}>
                      {/* 데스크탑 스크롤 오류 있을 수 있음 확인 */}
                      {time}
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">오후 9시부터 예약은 가게 전화로 부탁드립니다.</p>
            </div>
          </Modal>
        </>
      }
    </div >
  );
}
