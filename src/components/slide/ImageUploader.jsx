  import { useRef } from "react";

  export default function ImageUploader({ images, setImages }) {
    const fileInputRef = useRef(null); // 파일 입력 요소에 접근하기 위한 ref

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      const newImages = [...images];
      let index = 0;

      for (let i = 0; i < images.length; i++) {
        if (!newImages[i] && index < files.length) {
          const file = files[index];
          
          if (file.size > 2 * 1024 * 1024) {
            alert('이미지의 크기는 2MB 이하로 업로드 해주세요.');
            return;
          }

          const reader = new FileReader();

          reader.onloadend = () => {
            newImages[i] = { file, preview: reader.result };
            setImages([...newImages]);
          };

          reader.readAsDataURL(file);
          index++;
        }
      }
    };

    const handleRemoveImage = (indexToRemove) => {
      setImages(images.map((img, index) => (index === indexToRemove ? null : img)));
    };

    return (
      <div className="overflow-x-auto rounded-lg bg-neutral-100 p-3">
        <div className="flex min-w-max justify-between gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => fileInputRef.current.click()} // ref로 파일 입력 요소를 클릭
              className="relative h-60 w-60 flex-none cursor-pointer rounded-lg shadow-lg"
            >
              {image?.preview ? (
                <img
                  src={image.preview}
                  alt={`uploaded-${index}`}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-3 -translate-y-2 transform rounded-full bg-gray-300 p-2 text-white">
                  add_photo_alternate
                </span>
              )}

              {image?.file && (
                <span
                  className="material-symbols-outlined absolute -right-2.5 -top-2 rounded-full bg-white text-[1.3rem]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                >
                  close
                </span>
              )}
            </div>
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef} // 파일 입력 요소에 ref를 연결
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    );
  }
