import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import { decodeToken } from "../../utils/decodeToken";
import { api } from "../../services/api";
import { useForm } from "react-hook-form";
import ImageUploader from "../../components/slide/ImageUploader";
import { inputStyle, tomatoBtn } from "../../constants/style";
import Button from "../../components/Button";

export default function MenuUpdate() {
  const { accessToken } = useSelector((state) => state.authToken);
  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuImage, setMenuImage] = useState([null]);
  const [menuPrice, setMenuPrice] = useState("");

  const restaurant = useParams();
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm();

  useEffect(() => {
    const getMyMenu = async () => {
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
              `/public/restaurants/${restaurant.restaurantId}/menus`,
              config,
            );
            const menu = res.data.content.filter(
              (m) => m.id === parseInt(restaurant.menuId),
            );
            setMenu(menu[0]);
            setValue("menuName", menu[0].name);
            setMenuPrice(menu[0].price);
            if (menu[0].menuImage) {
              setMenuImage([
                { file: menu[0].menuImage, preview: menu[0].menuImage },
              ]);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        {
          alert("권한이 없습니다.");
          navigate("/");
        }
      }
    };
    getMyMenu();
  }, [accessToken, navigate]);
  const priceChangeHandler = (event) => {
    let price = event.target.value;

    price = price.replace(/[^0-9]/g, "");

    if (price) {
      setMenuPrice(Number(price).toLocaleString("ko-KR"));
    } else {
      setMenuPrice("");
    }
  };

  const updateMenuImage = async () => {
    const originalMenuImage = menu.menuImage;
    const currentMenuImage = menuImage[0].file;

    if (originalMenuImage === currentMenuImage) {
      console.log("메뉴 이미지 변경 여력 없음");
      return;
    }

    const formData = new FormData();
    if (menuImage[0]) {
      formData.append("menuImage", menuImage[0].file);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${accessToken.token}`,
      },
    };
    try {
      const res = api.patch(
        `/restaurants/${restaurant.restaurantId}/menus/${restaurant.menuId}/menu-image`,
        formData,
        config,
      );
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async () => {
    const data = {
      name: watch("menuName"),
      price: watch("menuPrice"),
    };

    const config = {
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `${accessToken.token}`,
      },
    };

    try {
      const res = await api.put(
        `/restaurants/${restaurant.restaurantId}/menus/${restaurant.menuId}`,
        data,
        config,
      );
      if (res.status === 200) {
        alert("메뉴가 정상적으로 수정되었습니다.");
      }
      navigate(`/owner/menu-manage/${restaurant.restaurantId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateMenuImage();
      await onSubmit();
    } catch (err) {
      console.error("업데이트 오류 발생 : ", err);
    }
  };

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-3">
          <p className="mt-2 text-lg">메뉴 수정하기</p>
          <form onSubmit={handleSubmit(handleUpdate)} noValidate>
            <label htmlFor="menuImage">메뉴 사진</label>
            <ImageUploader
              images={menuImage}
              setImages={(newImages) => {
                setMenuImage(newImages);
                if (newImages.some((img) => img === null)) {
                  setError("menuImage");
                } else {
                  clearErrors("menuImage");
                }
              }}
            />
            {isSubmitted && menuImage.some((img) => img === null) && (
              <small className="text-red-500">메뉴 사진을 등록해주세요.</small>
            )}
            <div className="flex flex-col gap-1">
              <label htmlFor="menu-name">메뉴명</label>
              <input
                type="text"
                className={`${inputStyle}`}
                placeholder="햄버거"
                id="menuName"
                {...register("menuName", {
                  required: "메뉴명을 입력해주세요.",
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
                {...register("menuPrice", {
                  required: "가격을 입력해주세요.",
                })}
                value={menuPrice}
                onChange={priceChangeHandler}
              />
            </div>
            {isSubmitted && errors.menuPrice && (
              <small className="text-red-500">{errors.menuPrice.message}</small>
            )}
            <Button className={tomatoBtn} style={"w-full"}>
              추가하기
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
