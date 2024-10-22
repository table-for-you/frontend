import { useState, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import { btn, inputStyle, tomatoBtn } from "../../constants/style";
import ImageUploader from "../../components/slide/ImageUploader";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { api } from "../../services/api";
import Loading from "../../components/Loading";
const { kakao } = window;

export default function UpdateRestaurant() {
  const { accessToken } = useSelector((state) => state.authToken);
  const { restaurantId } = useParams();
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [isParking, setIsParking] = useState(false);
  const [address, setAddress] = useState("");
  const [mainImage, setMainImage] = useState([null]);
  const [images, setImages] = useState([null, null, null, null]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [selectedFood, setSelectedFood] = useState("KOREAN");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const regionItems = [
    { id: "SEOUL", name: "서울" },
    { id: "JEJU", name: "제주" },
    { id: "CHUNGNAM", name: "충남" },
    { id: "INCHEON", name: "인천" },
    { id: "DAEGU", name: "대구" },
    { id: "DAEJEON", name: "대전" },
    { id: "GYEONGGI", name: "경기" },
    { id: "GYEONGNAM", name: "경남" },
    { id: "BUSAN", name: "부산" },
    { id: "JEONBUK", name: "전북" },
    { id: "ULSAN", name: "울산" },
    { id: "GWANGJU", name: "광주" },
    { id: "GANGWON", name: "강원" },
    { id: "GYEONGBUK", name: "경북" },
    { id: "JEONNAM", name: "전남" },
    { id: "CHUNGBUK", name: "충북" },
    { id: "SEJONG", name: "세종" },
  ];

  useEffect(() => {
    const fetchUpdateRestaurant = async () => {
      if (accessToken) {
        const decoded = decodeToken(JSON.stringify(accessToken));
        if (decoded.role === "OWNER") {
          const config = {
            headers: {
              Authorization: `${accessToken.token}`,
            },
          };

          try {
            const res = await api.get(
              `/public/restaurants/${restaurantId}`,
              config,
            );
            setRestaurantInfo(res.data);
            setSelectedRegion(res.data.region);
            setAddress(res.data.location);
            setLatitude(res.data.latitude);
            setLongitude(res.data.longitude);
            const [openTime, closeTime] = res.data.time.split(" ~ ");
            const [bn, mn, en] = res.data.tel.split("-");
            setValue("title", res.data.name);
            setValue("open-time", openTime);
            setValue("close-time", closeTime);
            setValue("bn", bn);
            setValue("mn", mn);
            setValue("en", en);

            if (res.data.mainImage) {
              setMainImage([
                { file: res.data.mainImage, preview: res.data.mainImage },
              ]);
            }

            if (res.data.subImages && res.data.subImages.length > 0) {
              const loadedSubImages = res.data.subImages.map((image) => ({
                file: image,
                preview: image,
              }));
              setImages(loadedSubImages);
            }

            setSelectedFood(res.data.foodType);
            setValue("seat", res.data.totalSeats);
            setIsParking(res.data.parking);
            setValue("description", res.data.description);
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
    fetchUpdateRestaurant();
  }, [accessToken, navigate, setValue, restaurantId]);

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

  const getAddressCoords = (address) => {
    return new Promise((resolve, reject) => {
      const geoCoder = new kakao.maps.services.Geocoder();

      geoCoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          resolve(coords);
        } else {
          reject(status);
        }
      });
    });
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region.id);
    setIsDropdownOpen(false);
  };

  const handleComplete = async (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    try {
      const coords = await getAddressCoords(fullAddress);

      setLatitude(coords.getLat());
      setLongitude(coords.getLng());
    } catch (err) {
      console.error("좌표 변환 실패: ", err);
      console.error(err);
    }

    setAddress(fullAddress);

    setIsPostcodeOpen(false);
  };

  const handleParkingCheck = () => {
    setIsParking(!isParking);
  };

  const updateMainImage = async () => {
    const originalMainImage = restaurantInfo.mainImage;
    const currentMainImage = mainImage[0].file;

    if (originalMainImage === currentMainImage) {
      console.log("메인 이미지 변경 여력 없음");
      return;
    }

    const formData = new FormData();

    if (mainImage[0]) {
      formData.append("mainImage", mainImage[0].file);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${accessToken.token}`,
      },
    };

    try {
      const res = await api.patch(
        `/owner/restaurants/${restaurantId}/main-image`,
        formData,
        config,
      );
      console.log(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const updateSubImages = async () => {
    const originalImages = restaurantInfo.subImages || [];
    const currentImages = images.map((image) => image?.preview || null);

    const deleteImageUrls = originalImages.filter(
      (originalImage) => !currentImages.includes(originalImage),
    );

    const newImages = images.filter((image) => {
      // image.file이 존재하는지 확인하고, 그 이미지가 originalImages 배열에 포함되지 않았는지 확인 (고차함수 이해하기)
      return (
        image?.file &&
        !originalImages.some((originalImage) => originalImage === image.preview)
      );
    });

    if (deleteImageUrls.length === 0) {
      console.log("서브 이미지 변경 이력 없음");
      return;
    }

    const formData = new FormData();

    newImages.forEach((image) => {
      if (image?.file) {
        formData.append("newImages", image.file);
      }
    });

    formData.append(
      "deleteImageUrls",
      new Blob([JSON.stringify(deleteImageUrls)], { type: "application/json" }),
    );

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${accessToken.token}`,
      },
    };

    try {
      const res = await api.patch(
        `/owner/restaurants/${restaurantId}/sub-image`,
        formData,
        config,
      );
    } catch (err) {
      console.error(err);
      console.log("새로운 이미지 배열", newImages);
      console.log("삭제할 이미지 URL : ", deleteImageUrls);
    }
  };

  const onSubmit = async () => {
    const data = {
      name: watch("title"),
      region: selectedRegion,
      location: address,
      latitude: latitude,
      longitude: longitude,
      time: watch("open-time") + " ~ " + watch("close-time"),
      tel: `${watch("bn")}-${watch("mn")}-${watch("en")}`,
      totalSeats: parseInt(watch("seat")),
      description: watch("description"),
      foodType: selectedFood,
      parking: isParking,
    };

    const config = {
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `${accessToken.token}`,
      },
    };

    try {
      const res = await api.put(
        `/owner/restaurants/${restaurantId}`,
        data,
        config,
      );
      if (res.status === 200) {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateMainImage();
      await updateSubImages();
      await onSubmit();
    } catch (err) {
      console.error("업데이트 오류 발생 : ", err);
    }
  };

  return (
    <>
      <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="mb-5">
              <div className="relatvie h-[40vh]">
                <img
                  src="/src/assets/title.jpg"
                  className="h-full w-full rounded-lg object-cover brightness-75"
                />
                <div className="absolute top-28 p-2 font-bold text-white">
                  <p className="mb-5 text-xl">점주님, 안녕하세요!</p>
                  <p className="mb-5">
                    가게 수정을 위해 필요한 몇 가지 정보를
                    <br />
                    입력해 주시면 감사하겠습니다.
                  </p>
                  <p>
                    저희 Table For you는
                    <br />
                    점주님의 가게 번창을 응원하며,
                    <br />늘 최선을 다하겠습니다.
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(handleUpdate)} noValidate>
              <div className="flex flex-col gap-3">
                <label htmlFor="restaurant-title">가게명</label>
                <div className="relative flex">
                  <input
                    type="text"
                    id="title"
                    className="w-full rounded-lg border p-2"
                    placeholder="테이블포유 레스토랑"
                    {...register("title", {
                      required: "가게명을 입력해주세요.",
                    })}
                  />
                </div>
                {errors.title && (
                  <small className="text-red-500">{errors.title.message}</small>
                )}

                <label htmlFor="restaurant-region">지역</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full rounded-lg border bg-neutral-100 p-2 text-left"
                  >
                    {selectedRegion || "지역을 선택해주세요"}
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute z-10 mt-1 max-h-36 w-full overflow-y-auto rounded-lg border bg-white">
                      {regionItems.map((region) => (
                        <li
                          key={region.id}
                          onClick={() => handleSelectRegion(region)}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          {region.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {!selectedRegion && isSubmitted && (
                  <small className="text-red-500">지역을 선택해주세요</small>
                )}

                <label htmlFor="location">상세 주소</label>
                <div className="flex">
                  <input
                    type="text"
                    id="location"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`${inputStyle} flex-1`}
                    placeholder="강남구 테헤란로"
                    readOnly
                  />
                  <Button
                    className={`${btn}`}
                    onClick={() => setIsPostcodeOpen(true)}
                    type="button"
                  >
                    찾기
                  </Button>
                </div>
                {!address && isSubmitted && (
                  <small className="text-red-500">
                    상세주소를 입력해주세요.
                  </small>
                )}

                {isPostcodeOpen && (
                  <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col rounded-lg bg-white p-6">
                      <button
                        className="mb-4 flex justify-end"
                        onClick={() => setIsPostcodeOpen(false)}
                      >
                        닫기
                      </button>
                      <DaumPostcode onComplete={handleComplete} />
                    </div>
                  </div>
                )}

                <label htmlFor="time">영업 시간</label>
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    id="open-time"
                    className={`${inputStyle} w-[50%]`}
                    {...register("open-time", {
                      required: true,
                    })}
                  />
                  <span className="text-lg">~</span>
                  <input
                    type="time"
                    id="close-time"
                    className={`${inputStyle} w-[50%]`}
                    {...register("close-time", {
                      required: true,
                    })}
                  />
                </div>

                {isSubmitted &&
                  (!watch("open-time") || !watch("close-time")) && (
                    <small className="text-red-500">
                      영업시간을 입력해주세요.
                    </small>
                  )}

                <label htmlFor="tel">가게 번호</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    className={`${inputStyle} w-[33%]`}
                    placeholder="02"
                    maxLength={3}
                    id="bn"
                    {...register("bn", {
                      required: true,
                    })}
                  />
                  <span className="text-lg">-</span>
                  <input
                    type="text"
                    className={`${inputStyle} w-[33%]`}
                    placeholder="1234"
                    maxLength={4}
                    id="mn"
                    {...register("mn", {
                      required: true,
                    })}
                  />
                  <span className="text-lg">-</span>
                  <input
                    type="text"
                    className={`${inputStyle} w-[33%]`}
                    placeholder="5678"
                    maxLength={4}
                    id="en"
                    {...register("en", {
                      required: true,
                    })}
                  />
                </div>
                {isSubmitted &&
                  (!watch("bn") || !watch("mn") || !watch("en")) && (
                    <small className="text-red-500">
                      가게번호를 입력해주세요.
                    </small>
                  )}

                <label htmlFor="mainImage">가게 대표 사진 (썸네일용)</label>
                <ImageUploader
                  images={mainImage}
                  setImages={(newImages) => {
                    setMainImage(newImages);
                    if (newImages.some((img) => img === null)) {
                      setError("mainImage");
                    } else {
                      clearErrors("mainImage");
                    }
                  }}
                />
                {isSubmitted && mainImage.some((img) => img === null) && (
                  <small className="text-red-500">
                    가게 대표 사진을 등록해주세요.
                  </small>
                )}

                <label htmlFor="subImage">가게 소개 사진</label>
                <ImageUploader
                  images={images}
                  setImages={(newImages) => {
                    setImages(newImages);
                    if (newImages.some((img) => img === null)) {
                      setError("images");
                    } else {
                      clearErrors("images");
                    }
                  }}
                />

                <p className="text-sm font-bold opacity-40">
                  각 이미지의 크기는 2MB 이하로 업로드 해주세요.
                </p>

                {isSubmitted && images.some((img) => img === null) && (
                  <small className="text-red-500">
                    가게 소개 사진을 4장 등록해주세요.
                  </small>
                )}

                <select
                  id="food-list"
                  className={`${inputStyle}`}
                  value={selectedFood}
                  onChange={(e) => setSelectedFood(e.target.value)}
                >
                  <option value="KOREAN">한식</option>
                  <option value="CHINESE">중식</option>
                  <option value="JAPANESE">일식</option>
                  <option value="WESTERN">양식</option>
                </select>

                <label htmlFor="seat">테이블</label>
                <input
                  type="number"
                  id="seat"
                  min={1}
                  className={`${inputStyle}`}
                  placeholder="1"
                  {...register("seat", {
                    required: "테이블을 입력해주세요",
                    min: {
                      value: 1,
                      message: "테이블 수는 최소 1 이상이어야 합니다.",
                    },
                  })}
                />
                {isSubmitted && errors.seat && (
                  <small className="text-red-500">{errors.seat.message}</small>
                )}

                <div className="flex items-center justify-between">
                  <label htmlFor="parking">주차 가능 여부</label>
                  <input
                    type="checkbox"
                    id="parking"
                    checked={isParking}
                    className="h-7 w-7"
                    onChange={handleParkingCheck}
                  />
                </div>

                <label htmlFor="description">가게 설명</label>
                <textarea
                  name=""
                  id="description"
                  className="h-40 resize-none rounded-lg bg-neutral-100 p-4"
                  placeholder="가게에 대한 설명을 적어주세요."
                  {...register("description", {
                    required: "가게 설명을 적어주세요.",
                  })}
                ></textarea>
                {isSubmitted && errors.description && (
                  <small className="text-red-500">
                    {errors.description.message}
                  </small>
                )}
                <div>
                  <Button className={tomatoBtn} style={`w-full`}>
                    수정하기
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
      <Modal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        contentMotion={contentMotion}
        parentClass={
          "fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        }
        childClass={"relative bg-neutral-100 px-6 py-2 rounded-lg text-center"}
      >
        <div className="mb-2">
          <p className="pb-6 sm:text-lg">가게 수정을 완료 하였어요!</p>
          <p>결과는 내 가게 목록에서 확인할 수 있어요.</p>
        </div>
        <div className="mt-auto w-full">
          <Button
            className={tomatoBtn}
            style={"w-full text-sm"}
            onClick={() => navigate("/owner/my-restaurant")}
          >
            내 가게 목록으로 이동하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
