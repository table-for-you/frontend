import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-2">
      <BarLoader color="#ff0000" />
    </div>
  );
}
