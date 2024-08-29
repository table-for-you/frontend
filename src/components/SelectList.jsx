export default function SelectList() {
  return (
    <div>
      <select className="rounded-lg bg-neutral-100 p-2">
        <option value="distance" selected>
          거리순
        </option>
        <option value="highest-rating">평점순</option>
        <option value="most-reviews">리뷰순</option>
      </select>
    </div>
  );
}
