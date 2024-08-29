export default function Filter() {
  return (
    <div className="flex w-48 flex-col gap-2 p-3 shadow-lg">
      <div className="flex flex-col gap-2">
        <span>필터</span>
        <div className="flex gap-1">
          <input type="checkbox" name="full" id="full" />
          <label htmlFor="full">매진 식당 제외</label>
        </div>
        <div className="flex gap-1 border-b-2">
          <input type="checkbox" name="parking" id="parking" />
          <label htmlFor="parking" className="pb-2">
            주차 가능
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span>가게 유형</span>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <input type="radio" id="all" name="type" />
            <label htmlFor="all">전체</label>
          </div>
          <div className="flex gap-1">
            <input type="radio" id="korean-food" name="type" />
            <label htmlFor="korean-food">한식</label>
          </div>
          <div className="flex gap-1">
            <input type="radio" id="chinese-food" name="type" />
            <label htmlFor="chinese-food">중식</label>
          </div>
          <div className="flex gap-1">
            <input type="radio" id="western-food" name="type" />
            <label htmlFor="western-food">양식</label>
          </div>
          <div className="flex gap-1">
            <input type="radio" id="japanese-food" name="type" />
            <label htmlFor="japanese-food">일식</label>
          </div>
        </div>
      </div>
    </div>
  );
}
