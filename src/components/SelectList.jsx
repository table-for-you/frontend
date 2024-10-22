export default function SelectList({ handleSortChange }) {
  return (
    <div>
      <select
        className="rounded-lg bg-neutral-100 p-2"
        onChange={handleSortChange}
      >
        <option value="rating">평점 높은 순</option>
        <option value="ratingNum">리뷰 많은 순</option>
      </select>
    </div>
  );
}
