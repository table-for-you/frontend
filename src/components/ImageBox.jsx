export default function ImageBox({ imageSrc, divClass }) {
  return (
    <div className={divClass}>
      <img className="w-full cursor-pointer rounded-lg" src={imageSrc} />
    </div>
  );
}
