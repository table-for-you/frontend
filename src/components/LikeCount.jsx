export default function LikeCount({ likeCount }) {
  return (
    <div className="flex gap-1 text-sm">
      <span>❤️</span>
      <span>{likeCount}</span>
      <span className="opacity-50">좋아요</span>
    </div>
  );
}
