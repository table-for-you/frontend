export default function Rating({ rating, ratingNum }) {
    return (
        <div className="text-sm flex gap-1">
            <span>⭐</span>
            <span>{parseFloat(rating.toFixed(2))}</span>
            <span className="opacity-50">
                평점 &#40;{ratingNum}&#41;
            </span>
        </div>
    )
}