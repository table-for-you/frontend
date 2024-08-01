import { useState, useEffect } from "react";
import Button from "./Button";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200);
    addEventListener("resize", handleResize);
    return () => removeEventListener("resize", handleResize);
  });

  return (
    <header className="flex h-20 items-center justify-around border-b">
      <div>
        <span
          className="cursor-pointer text-2xl font-bold text-tomato-color"
          onClick={() => navigate("/")}
        >
          Table For You
        </span>
      </div>
      <div>
        {windowWidth > 768 ? (
          <Button onClick={() => navigate("/login")}>로그인</Button>
        ) : (
          <Button style="material-symbols-outlined">menu</Button>
        )}
      </div>
    </header>
  );
}
