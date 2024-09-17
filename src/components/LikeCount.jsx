export default function LikeCount({ likeCount }) {
    return (
        <div className="text-sm flex gap-1">
            <span>❤️</span>
            <span>{likeCount}</span>
            <span className="opacity-50">
                좋아요
            </span>
        </div>
    )
}