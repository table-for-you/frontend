import { useState } from "react";

export default function ImageUploader() {
    const [images, setImages] = useState([null, null, null, null]);

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
        setImages(images.map((img, index) => (index === indexToRemove) ? null : img));
    }

    return (
        <div className="bg-neutral-100 rounded-lg p-3 overflow-x-auto">
            <div className="flex justify-between min-w-max gap-2">
                {images.map((image, index) => (
                    <div
                        key={index}
                        onClick={() => document.getElementById('imageInput').click()}
                        className="w-60 h-60 rounded-lg shadow-lg relative cursor-pointer flex-none"
                    >
                        {image ? (
                            <img
                                src={image}
                                alt={`uploaded-${index}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) :
                            <span className="material-symbols-outlined absolute top-1/2 left-1/2 transform -translate-x-3 -translate-y-2 p-2 rounded-full bg-gray-300 text-white">
                                add_photo_alternate
                            </span>
                        }

                        {image && (
                            <span
                                className="material-symbols-outlined absolute -right-2.5 -top-2 bg-white rounded-full text-[1.3rem]"
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
    )
}
