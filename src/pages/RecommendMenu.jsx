import { useState } from "react";
import Button from "../components/Button";
import { tomatoBtn } from "../constants/style";
import { useNavigate } from "react-router-dom";

export default function RecommendMenu() {
    const [day, setDay] = useState(new Date().getDay());
    const [selectedFood, setSelectedFood] = useState([]);
    const [resultFood, setResultFood] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFading, setIsFading] = useState(false); 
    const [searchType, setSearchType] = useState("food");
    const navigate = useNavigate();
    const [navi, setNavi] = useState(false);

    const dayList = ['일', '월', '화', '수', '목', '금', '토'];
    const rankList = ['사원', '부장', '차장', '과장', '대리', '사원', '부장'];
    const foodList = ['한식', '중식', '일식', '양식'];

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setSelectedFood([...selectedFood, value]);
        } else {
            setSelectedFood(selectedFood.filter((food) => food !== value));
        }
    };

    const handleRandomClick = () => {
        if (selectedFood.length > 0) {
            setIsAnimating(true);
            setNavi(false);
            setIsFading(false);
            let count = 0;
            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * selectedFood.length);
                setResultFood(selectedFood[randomIndex]);
                count++;

                if (count > 10) {
                    clearInterval(interval);
                    setIsAnimating(false);
                    setTimeout(() => { setIsFading(true), setNavi(true) }, 100);
                }
            }, 100);
        }
    };

    const label = dayList[day];
    const rank = rankList[day];

    return (
        <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72 bg-red-400 h-[80vh] text-white">
            <div className="text-center flex flex-col h-full justify-around">
                <div className="text-2xl">
                    <p>오늘은 {label}요일, {rank}님을 위한 날.</p>
                </div>

                <div>
                    <p className="text-2xl mb-5">음식 종류 고르기</p>
                    <div className="flex gap-3 justify-center">
                        {foodList.map((foodType, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-full cursor-pointer
                                    ${selectedFood.includes(foodType) ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                            >
                                <input
                                    type="checkbox"
                                    value={foodType}
                                    onChange={handleCheckboxChange}
                                    id={foodType}
                                    className="hidden"
                                />
                                <label
                                    htmlFor={foodType}
                                    className="cursor-pointer"
                                >
                                    {foodType}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="mb-2 text-2xl">선택한 음식 종류</p>
                    <div className="flex justify-center gap-3">
                        {selectedFood.length > 0 && (
                            selectedFood.map((food, index) => (
                                <span key={index} className="mr-1 text-xl">
                                    {food}
                                </span>
                            ))
                        )}
                    </div>
                </div>

                <div className="text-2xl sm:text-3xl">
                    <p>
                        {rank}님은 오늘&nbsp;&#91;&nbsp;
                        <span
                            className={`text-2xl sm:text-3xl font-bold transition-opacity duration-700 ${isFading ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {resultFood}
                        </span>
                        &nbsp;&#93;이 땡긴다.
                    </p>
                </div>

                <div>
                    <Button
                        className={`${tomatoBtn} border-0 disabled:opacity-50 `}
                        onClick={handleRandomClick}
                        disabled={isAnimating}
                    >
                        {isAnimating ? "추천 중..." : "돌리기"}
                    </Button>
                </div>
                {navi && (
                    <div>
                        <Button
                            onClick={() => navigate(`/restaurant/${resultFood}/`, { state: { searchType: searchType } })}
                            className={`${tomatoBtn} border-0`}
                        >
                            {resultFood} 예약 하러 가기
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
