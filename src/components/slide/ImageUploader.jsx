import { useState } from "react";

export default function ImageUploader({images, setImages}) {

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];
    let index = 0;

    for (let i = 0; i < images.length; i++) {
      if (!newImages[i] && index < files.length) {
        newImages[i] = URL.createObjectURL(files[index]);
        index++;
      }
    }

    setImages(newImages);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(
      images.map((img, index) => (index === indexToRemove ? null : img)),
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg bg-neutral-100 p-3">
      <div className="flex min-w-max justify-between gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => document.getElementById("imageInput").click()}
            className="relative h-60 w-60 flex-none cursor-pointer rounded-lg shadow-lg"
          >
            {image ? (
              <img
                src={image}
                alt={`uploaded-${index}`}
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-3 -translate-y-2 transform rounded-full bg-gray-300 p-2 text-white">
                add_photo_alternate
              </span>
            )}

            {image && (
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
        id="imageInput"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}
