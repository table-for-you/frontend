export default function Rating({ rating, ratingNum }) {
  return (
    <div className="flex gap-1 text-sm">
      <span>⭐</span>
      <span>
        {Number.isInteger(rating) ? rating.toFixed(1) : rating.toFixed(2)}
      </span>
      <span className="opacity-50">리뷰 &#40;{ratingNum}&#41;</span>
    </div>
  );
}
