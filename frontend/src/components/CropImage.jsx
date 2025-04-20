import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const CropImage = ({ saveCroppedImage }) => {
  const [image, setImage] = useState(null);
  const cropperRef = useRef(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError(null);

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.onerror = () => {
        setError('Error reading the image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas();
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            saveCroppedImage(blob);
            setImage(null); // Reset the original image
          }
        }, "image/jpeg");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <label className="w-full max-w-xs px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 text-center">
          Choose Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </div>

      {image && (
        <div className="space-y-4">
          <Cropper
            src={image}
            style={{ height: 400, width: "100%" }}
            aspectRatio={1}
            guides={true}
            ref={cropperRef}
            viewMode={1}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
          />
          <div className="flex justify-center">
            <button
              onClick={handleCrop}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Crop Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropImage;
