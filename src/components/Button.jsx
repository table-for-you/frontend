import { btn } from "../constants/style"

export default function Button({ btnName, className = btn, style, ...props }) {
    return <button className={`${className} ${style}`} {...props} >{btnName}</button>
}

