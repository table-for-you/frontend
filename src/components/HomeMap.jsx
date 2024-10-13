import KakaoMap from "./KakaoMap";

export default function HomeMap() {
  return (
    <div className="mt-12">
      <p className="mb-4">지도로 찾기</p>
      <div>
        <KakaoMap size={"w-full min-h-[80vh] rounded-lg"} />
      </div>
    </div>
  );
}
