import { useState } from "react"
import { inputStyle } from "../../constants/style"


export default function SearchType({ handleTypeChange }) {
    return (
        <div>
            <select
                className={`${inputStyle} w-full cursor-pointer text-[1rem] active:bg-white`}
                onChange={handleTypeChange}
            >
                <option value="region">지역</option>
                <option value="restaurant">식당명</option>
                <option value="location">주소</option>
                <option value="food">종류</option>
            </select>
        </div>
    )
}