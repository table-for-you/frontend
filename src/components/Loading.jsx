import { BarLoader } from "react-spinners";


export default function Loading() {
    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-2">
            <BarLoader color="#ff0000"/>
        </div>
    )
}