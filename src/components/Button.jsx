import { btn } from "../constants/style"

export default function Button({ btnName, className = btn }) {
    return <button className={className}>{btnName}</button>
}

