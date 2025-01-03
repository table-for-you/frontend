import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const regionMap = [
    "서울",
    "제주",
    "충남",
    "인천",
    "대구",
    "대전",
    "경기",
    "경남",
    "부산",
    "전북",
    "울산",
    "광주",
    "강원",
    "경북",
    "전남",
    "충북",
    "세종",
  ];

  const chunkedRegions = regionMap.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 4);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return (
    <div className="h-auto min-h-full px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <div className="opacity-40">
        <span className="font-bold">Table For You</span>

        <div className="mt-2 flex justify-between text-sm">
          <ul>
            <li
              className="inline-block cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              로그인
            </li>
            <li
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              회원가입
            </li>
          </ul>

          {/* 지역을 4개씩 끊어서 나눈 부분 */}
          {chunkedRegions.map((regionChunk, idx) => (
            <ul key={idx} className="flex flex-col">
              {regionChunk.map((region) => (
                <li
                  key={region}
                  className="inline-block cursor-pointer hover:underline"
                  onClick={() => navigate(`/restaurant/${region}`)}
                >
                  {region}
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-4">
          <p className="text-xs">
            본 페이지는 실서비스가 아닌 프로젝트 목적으로 이용이 되며, <br />
            유저, 점주, 식당 등 페이지에서 나타나는 데이터는 임의로 생성된 것을
            알려드립니다.
          </p>
        </div>
      </div>
    </div>
  );
}
