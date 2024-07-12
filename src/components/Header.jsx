import { useState, useEffect } from "react"
import { btn } from "../constants/style"
import Button from "./Button"
import { debounce } from "lodash";

export default function Header() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = debounce(() => {
            setWindowWidth(window.innerWidth);
        }, 200);
        addEventListener('resize', handleResize);
        return () => removeEventListener('resize', handleResize);
    });

    return (
        <header className="flex justify-around items-center h-20 border-b">
            <div>
                <span className="text-2xl text-tomato-color font-bold cursor-pointer">Table For You</span>
            </div>
            <div>
                {windowWidth > 768 ?
                    <Button btnName={"로그인"}></Button> :
                    <Button className={btn + " material-symbols-outlined"} btnName={"menu"}></Button>
                }
            </div>
        </header>
    )
}