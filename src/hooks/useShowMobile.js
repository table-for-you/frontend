import { useState, useEffect } from "react";

export function useShowMobile() {
  const [showMobile, setShowMobile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { // 아이패드 에어 모바일로 간주
    const handleSize = () => {
      if (window.matchMedia("(max-width: 820px)").matches) {
        setShowMobile(true);
      } else if (window.matchMedia("(min-width: 821px)").matches) {
        setShowMobile(false);
        setIsModalOpen(false);
      }
    };

    handleSize();

    const mediaQueryLists = [
      window.matchMedia("(max-width: 820px)"),
      window.matchMedia("(min-width: 821px)"),
    ];

    mediaQueryLists.forEach((mql) => {
      mql.addEventListener("change", handleSize);
    });

    return () => {
      mediaQueryLists.forEach((mql) => {
        mql.removeEventListener("change", handleSize);
      });
    };
  }, []);

  useEffect(() => {
    // 모바일 모드에서 모달이 열리면 스크롤 막기
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  return { showMobile, isModalOpen, setIsModalOpen };
}
