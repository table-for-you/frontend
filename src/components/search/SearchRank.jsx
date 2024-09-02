export default function searchRank({ onSelectRegion }) {
  const regions = ["대구", "부산", "서울", "제주", "전주"];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="font-bold">인기 지역 순위</span>
      </div>
      <div className="flex flex-col justify-center gap-3">
        {regions.map((region, index) => (
          <div
            key={region}
            className="flex cursor-pointer gap-3"
            onClick={() => onSelectRegion(region)}
          >
            <span className="font-bold">{index + 1}</span>
            <span className="opacity-75">{region}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
