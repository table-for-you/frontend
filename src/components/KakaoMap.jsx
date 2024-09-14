import { useEffect, useState } from "react";
const { kakao } = window;

export default function KakaoMap({ size }) {
  const [map, setMap] = useState(null);
  const [level, setLevel] = useState(3);

  useEffect(() => {
    const container = document.getElementById("map"); // 지도 담을 영역 DOM 래퍼런스
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container, options);
    setMap(map);

    setLevel(map.getLevel());
  }, []);

  const zoomIn = () => {
    if (map) {
      const currentLevel = map.getLevel();
      map.setLevel(currentLevel - 1);
      setLevel(currentLevel - 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      const currentLevel = map.getLevel();
      map.setLevel(currentLevel + 1);
      setLevel(currentLevel + 1);
    }
  };

  return (
    <div className="relative">
      <div id="map" className={`${size}`}></div>
      <span
        className="material-symbols-outlined absolute bottom-3 right-11 z-50 cursor-pointer rounded-full bg-black text-white opacity-30"
        onClick={zoomOut}
      >
        remove
      </span>
      <span
        className="material-symbols-outlined absolute bottom-3 right-3 z-50 cursor-pointer rounded-full bg-black text-white opacity-30"
        onClick={zoomIn}
      >
        add
      </span>
    </div>
  );
}
