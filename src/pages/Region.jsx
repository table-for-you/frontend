import { useParams } from "react-router-dom";
import Filter from "../components/Filter";
import SelectList from "../components/SelectList";

export default function Region() {
  const { name } = useParams();

  return (
    <div className="px-5 pt-5 md:px-14 lg:px-28 xl:px-44 2xl:px-72">
      <div className="flex gap-6">
        <Filter />
        <div className="flex w-full justify-between">
          <span className="p-2 text-xl">{`'${name}' 검색 결과 2개`}</span>
          <SelectList />
        </div>
      </div>
    </div>
  );
}

// 지도 맵 키 가려야함 ok, ux꾸미고 => 모든 컴포넌트 최적화(재사용, 파일 위치 등) 진행
