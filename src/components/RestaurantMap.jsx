import { useEffect, useState } from "react";
const { kakao } = window;

export default function RestaurantMap({ size, latitude, longitude, name }) {
  const [map, setMap] = useState(null);
  const [level, setLevel] = useState(9);

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };

    const map = new kakao.maps.Map(container, options);
    setMap(map);

    setLevel(map.getLevel());
  }, []);

  const markerPosition = new kakao.maps.LatLng(latitude, longitude);
  const marker = new kakao.maps.Marker({
    position: markerPosition,
  });
  marker.setMap(map);

  const iwContent = `<div style="padding:5px; font-size:0.8rem;" >${name}</div>`,
    iwPosition = new kakao.maps.LatLng(latitude, longitude);

  const infowindow = new kakao.maps.InfoWindow({
    position: iwPosition,
    content: iwContent,
  });

  infowindow.open(map, marker);

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
