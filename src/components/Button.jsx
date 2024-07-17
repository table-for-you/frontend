import { btn } from "../constants/style"

export default function Button({ btnName, className = btn, ...props }) {
    return <button className={className} {...props} >{btnName}</button>
}

