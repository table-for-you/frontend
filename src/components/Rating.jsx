export default function Rating({ rating, ratingNum }) {
    return (
        <div className="text-sm flex gap-1">
            <span>⭐</span>
            <span>{rating}</span>
            <span className="opacity-50">
                {ratingNum} 평점
            </span>
        </div>
    )
}