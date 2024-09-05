import { useState, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import { btn, inputStyle, tomatoBtn, } from "../../constants/style";
import ImageUploader from "../../components/slide/ImageUploader";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import { useNavigate } from "react-router-dom";
const { kakao } = window;



export default function RestaurantRegister() {
  const { accessToken } = useSelector(
    (state) => state.authToken,
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      const decoded = decodeToken(JSON.stringify(accessToken));
      if (decoded.role === "OWNER") {
        console.log('owner임')
      } else {
        alert("권한이 없습니다.");
        navigate("/");
      }
    } else {
      alert("권한이 없습니다.");
      navigate("/");
    }
  }, [accessToken, navigate]);





  const {
    register,
    watch,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitted, },
  } = useForm();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [isParking, setIsParking] = useState(false);
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([null, null, null, null]);

  const regionItems = [
    { id: "seoul", name: "서울" },
    { id: "jeju", name: "제주도" },
    { id: "chungnam", name: "충남" },
    { id: "incheon", name: "인천" },
    { id: "daegu", name: "대구" },
    { id: "daejeon", name: "대전" },
    { id: "gyeonggi", name: "경기" },
    { id: "gyeongnam", name: "경남" },
    { id: "busan", name: "부산" },
    { id: "jeonbuk", name: "전북" },
    { id: "ulsan", name: "울산" },
    { id: "gwangju", name: "광주" },
    { id: "gangwon", name: "강원" },
    { id: "gyeongbuk", name: "경북" },
    { id: "jeonnam", name: "전남" },
    { id: "chungbuk", name: "충북" },
    { id: "sejong", name: "세종" },
  ];




  const getAddressCoords = (address) => {
    return new Promise((resolve, reject) => {
      const geoCoder = new kakao.maps.services.Geocoder();

      geoCoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].x, result[0].y);
          resolve(coords);
        } else {
          reject(status);
        }
      });
    });
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region.name);
    setIsDropdownOpen(false);
  };

  const handleComplete = async (data) => {
    let fullAddress = data.address;
    let extraAddress = "";
    let latitude = 0;
    let longitude = 0;

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
      console.log("위도:", coords.getLat());
      console.log("경도:", coords.getLng());
    } catch (err) {
      console.error(err);
    }

    setAddress(fullAddress);
    setIsPostcodeOpen(false);
  };

  const handleParkingCheck = () => {
    setIsParking(!isParking);
  }


  const onSubmit = (data) => {
    console.log(data);
  }



  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <div className="mb-5">
        <div className="relatvie h-[40vh]">
          <img
            src="/src/assets/title.jpg"
            className="h-full w-full rounded-lg object-cover brightness-75"
          />
          <div className="absolute top-28 p-2 font-bold text-white">
            <p className="mb-5 text-xl">점주님, 안녕하세요!</p>
            <p className="mb-5">
              가게 등록을 위해 필요한 몇 가지 정보를
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
      <form onSubmit={handleSubmit(onsubmit)} noValidate>
        <div className="flex flex-col gap-3">
          <label htmlFor="restaurant-title">가게명</label>
          <div className="relative flex">
            <input
              type="text"
              id="title"
              className="rounded-lg border p-2 w-full"
              placeholder="테이블포유 레스토랑"
              {...register("title", {
                required: "가게명을 입력해주세요."
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
            <small className="text-red-500">상세주소를 입력해주세요.</small>
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
              {...register('open-time', {
                required: true
              })}
            />
            <span className="text-lg">~</span>
            <input
              type="time"
              id="close-time"
              className={`${inputStyle} w-[50%]`}
              {...register('close-time', {
                required: true
              })}
            />
          </div>

          {isSubmitted && (!watch('open-time') || !watch('close-time')) && (
            <small className="text-red-500">영업시간을 입력해주세요.</small>
          )}


          <label htmlFor="tel">가게 번호</label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              className={`${inputStyle} w-[33%]`}
              placeholder="02"
              id="bn"
              {...register('bn', {
                required: true
              })}
            />
            <span className="text-lg">-</span>
            <input
              type="text"
              className={`${inputStyle} w-[33%]`}
              placeholder="1234"
              id="mn"
              {...register('mn', {
                required: true
              })}
            />
            <span className="text-lg">-</span>
            <input
              type="text"
              className={`${inputStyle} w-[33%]`}
              placeholder="5678"
              id="en"
              {...register('en', {
                required: true
              })}
            />
          </div>
          {isSubmitted && (!watch('bn') || !watch('mn') || !watch('en')) && (
            <small className="text-red-500">가게번호를 입력해주세요.</small>
          )}

          <label htmlFor="picture">가게 대표 사진</label>
          <ImageUploader
            images={images}
            setImages={(newImages) => {
              setImages(newImages);
              if (newImages.some(img => img !== null)) {
                clearErrors("images");
              }
            }}
          />
          {isSubmitted && images.some(img => img === null) && (
            <small className="text-red-500">가게 대표 사진을 4장 등록해주세요.</small>
          )}

          <select name="" id="food-list" className={`${inputStyle}`}>
            <option value="">한식</option>
            <option value="">중식</option>
            <option value="">일식</option>
            <option value="">양식</option>
          </select>

          <label htmlFor="seat">좌석</label>
          <input
            type="number"
            id="seat"
            min={1}
            className={`${inputStyle}`}
            placeholder="1"
            {...register("seat", {
              required: "좌석을 입력해주세요",
              min: {
                value: 1,
                message: "좌석 수는 최소 1 이상이어야 합니다."
              }
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
            {...register('description', {
              required: "가게 설명을 적어주세요."
            })}
          ></textarea>
          {isSubmitted && errors.description && (
            <small className="text-red-500">{errors.description.message}</small>
          )}


          <div>
            <p className="mb-2 text-sm font-bold opacity-40">
              승인 검토는 최대 3일 요소되며, <br />
              결과는 마이페이지에서 확인할 수 있습니다.
            </p>
            <Button
              className={tomatoBtn}
              style={`w-full`}
            >
              등록하기
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}