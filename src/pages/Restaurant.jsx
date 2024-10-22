import { useLocation, useNavigate, useParams } from "react-router-dom";
import Filter from "../components/Filter";
import SelectList from "../components/SelectList";
import { api } from "../services/api";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Rating from "../components/Rating";

import Button from "../components/Button";
import SearchRestaurant from "../components/search/SearchRestaurant";
import SearchType from "../components/search/SearchType";

export default function Restaurant() {
  const [restaurantList, setRestaurantList] = useState([]);
  const { name } = useParams();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [myMenu, setMyMenu] = useState([]);
  const [sortOpt, setSortOpt] = useState("rating");
  const [filteredRestaurantList, setFilteredRestaurantList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchType, setSearchType] = useState("location");
  const [searchInputValue, setSearchInputValue] = useState("");

  const search = (type, searchInputValue) => {
    if (!searchInputValue.trim()) {
      alert("검색어를 입력해 주세요.");
      return;
    }
    setPage(0);
    navigate(`/restaurant/${searchInputValue}/`, {
      state: { searchType: type },
    });
  };

  const handleTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const regionMap = {
    서울: "SEOUL",
    제주: "JEJU",
    충남: "CHUNGNAM",
    인천: "INCHEON",
    대구: "DAEGU",
    대전: "DAEJEON",
    경기: "GYEONGGI",
    경남: "GYEONGNAM",
    부산: "BUSAN",
    전북: "JEONBUK",
    울산: "ULSAN",
    광주: "GWANGJU",
    강원: "GANGWON",
    경북: "GYEONGBUK",
    전남: "JEONNAM",
    충북: "CHUNGBUK",
    세종: "SEJONG",
  };

  const foodTypeMap = {
    한식: "KOREAN",
    중식: "CHINESE",
    일식: "JAPANESE",
    양식: "WESTERN",
  };

  const covertFoodType = {
    KOREAN: "한식",
    CHINESE: "중식",
    JAPANESE: "일식",
    WESTERN: "양식",
  };

  useEffect(() => {
    const fetchRestaurantList = async () => {
      try {
        let searchName = name;

        if (state?.searchType === "region" && regionMap[searchName]) {
          searchName = regionMap[searchName];
        }

        if (state?.searchType === "food" && foodTypeMap[searchName]) {
          searchName = foodTypeMap[searchName];
        }

        const params = {
          type: state?.searchType || "location",
          "search-keyword": searchName,
          "sort-by": sortOpt,
          page: page, // 현재 페이지 번호 추가
          size: 10, // 한 페이지당 보여줄 아이템 수
        };
        const res = await api.get("/public/restaurants", { params });
        setRestaurantList(res.data.content);
        setFilteredRestaurantList(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurantList();
  }, [name, sortOpt, page]);

  useEffect(() => {
    const applyFilters = () => {
      let filteredList = [...restaurantList];

      if (selectedFilters.includes("주차 가능")) {
        filteredList = filteredList.filter(
          (restaurant) => restaurant.parking === true,
        );
      }

      const foodFilters = selectedFilters.filter((filter) =>
        ["한식", "중식", "일식", "양식"].includes(filter),
      );

      if (foodFilters.length > 0) {
        filteredList = filteredList.filter((restaurant) =>
          foodFilters.includes(covertFoodType[restaurant.foodType]),
        );
      }

      setFilteredRestaurantList(filteredList);
    };

    applyFilters();
  }, [selectedFilters, restaurantList]);

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  const navigate = useNavigate();

  const handleShowRestaurantDetail = (restaurantId) => {
    navigate(`/restaurant/${name}/details/${restaurantId}`);
  };

  const handleSortChange = (e) => {
    setSortOpt(e.target.value);
  };

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <div className="mb-8 flex flex-col items-center justify-between gap-2 md:flex-row">
        <Filter onFilterChange={handleFilterChange} />

        <div className="flex items-center justify-center gap-3">
          <SearchRestaurant
            searchInputValue={searchInputValue}
            setSearchInputValue={setSearchInputValue}
            onSearch={() => search(searchType, searchInputValue)}
          />
          <SearchType handleTypeChange={(e) => handleTypeChange(e)} />
          <span
            className="material-symbols-outlined cursor-pointer rounded-md bg-red-500 p-0.5 text-white transition duration-200 hover:bg-red-600"
            onClick={() => search(searchType, searchInputValue)}
          >
            search
          </span>
        </div>
      </div>

      <div className="mt-2 flex gap-6">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex w-full flex-col gap-3">
            <div className="flex justify-between">
              <span className="p-2 text-xl font-bold">{`'${name}' 식당 ${filteredRestaurantList.length}개`}</span>
              <SelectList handleSortChange={handleSortChange} />
            </div>
            {filteredRestaurantList.map((restaurant) => (
              <div
                className="flex cursor-pointer flex-col gap-1 px-6 py-8 shadow-lg sm:flex-row"
                onClick={() => handleShowRestaurantDetail(restaurant.id)}
                key={restaurant.id}
              >
                <div className="h-[196px] w-[300px]">
                  <img src={restaurant.mainImage} className="rounded-lg" />
                </div>
                <div className="flex flex-col gap-1 text-lg sm:ml-5">
                  <div className="flex items-center gap-1 font-bold">
                    <span>{restaurant.name}</span>
                    <span className="text-xs opacity-50">
                      {covertFoodType[restaurant.foodType]}
                    </span>
                  </div>
                  <p className="text-xs">{restaurant.location}</p>
                  <Rating
                    rating={restaurant.rating}
                    ratingNum={restaurant.ratingNum}
                  />
                  <span className="text-sm opacity-50">
                    {restaurant.parking && (
                      <span className="rounded-lg bg-neutral-200 p-1 text-xs opacity-75">
                        주차 가능
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
            {(filteredRestaurantList.length >= 10 ||
              filteredRestaurantList.length !== 0) && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="mr-2 rounded-xl bg-red-500 px-4 py-2 text-white disabled:opacity-50"
                >
                  이전
                </button>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="rounded-xl bg-red-500 px-4 py-2 text-white disabled:opacity-50"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
