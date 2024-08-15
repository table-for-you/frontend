import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="grid h-[calc(100vh-20rem)] place-items-center text-gray-400">
      <div className="flex-col text-center">
        <span className="material-symbols-outlined text-6xl">
          error
        </span>
        <p className="text-lg font-bold">찾을 수 없는 페이지에요</p>
        <p className="text-sm">찾고 있는 페이지 주소가 변경 또는 삭제되었을 수 있어요.</p>
        <p className="text-sm">[에러코드: 404]</p>
        <span className="text-sm cursor-pointer text-blue-600" onClick={() => navigate('/')}>홈으로 이동</span>
      </div>
    </div>
  );
}
