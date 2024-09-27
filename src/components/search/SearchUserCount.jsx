import { useState } from "react";
import { inputStyle } from "../../constants/style";

export default function SearchUserCount() {
  const [userCount, setUserCount] = useState(1);
  const [showUser, setShowUser] = useState(false);

  const handleIncreaseCount = () => {
    setUserCount((prevCount) => prevCount + 1);
  };

  const handleDecreaseCount = () => {
    setUserCount((prevCount) => prevCount - 1);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={`인원 선택 : ${userCount}명`}
        className={`${inputStyle} w-full cursor-pointer text-[1rem] active:bg-white`}
        onClick={() => setShowUser(!showUser)}
        readOnly
      />

      {showUser && (
        <div className="absolute w-full rounded-lg bg-white p-2 text-sm">
          <span>인원</span>
          <div className="flex justify-between">
            <p className="text-xs font-bold opacity-35">
              유아 및 아동도
              <br />
              인원수에 포함해주세요.
            </p>
            <div className="flex items-center gap-2">
              {userCount <= 1 ? (
                <span className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 opacity-50">
                  remove
                </span>
              ) : (
                <span
                  className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 hover:bg-gray-100 active:bg-gray-200"
                  onClick={handleDecreaseCount}
                >
                  remove
                </span>
              )}
              <span className="p-1 text-xl font-bold">{userCount}</span>
              {userCount >= 99 ? (
                <span className="material-symbols-outlined cursor-pointer rounded-full border-2 p-1 opacity-50">
                  add
                </span>
              ) : (
                <span
                  className="material-symbols-outlined ounded-full cursor-pointer rounded-full border-2 p-1 hover:bg-gray-100 active:bg-gray-200"
                  onClick={handleIncreaseCount}
                >
                  add
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
