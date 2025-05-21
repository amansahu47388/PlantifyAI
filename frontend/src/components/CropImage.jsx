import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const CropImage = ({ saveCroppedImage }) => {
  const [image, setImage] = useState(null);
  const cropperRef = useRef(null);
  const [error, setError] = useState(null);
  const [cropData, setCropData] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError(null);

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Check file size (optional, set to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
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
      const cropper = cropperRef.current.cropper;

      // Get current crop box data
      const cropBoxData = cropper.getCropBoxData();

      // Force crop box to be 224x224
      cropper.setCropBoxData({
        ...cropBoxData,
        width: 224,
        height: 224
      });

      // Get the canvas with exact dimensions
      const canvas = cropper.getCroppedCanvas({
        width: 224,
        height: 224,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });

      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a preview
            const previewUrl = URL.createObjectURL(blob);
            setCropData(previewUrl);

            saveCroppedImage(blob);
            setImage(null); // Reset the original image
          }
        }, "image/jpeg", 0.95); // High quality JPEG
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
          <div className="text-center text-sm text-gray-600 mb-2">
            Crop area is fixed to 224x224 pixels for optimal analysis
          </div>
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
            cropBoxResizable={false} // Disable resizing
            minCropBoxWidth={224}
            minCropBoxHeight={224}
            data={{ width: 224, height: 224 }} // Initial crop box size
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

      {cropData && (
        <div className="mt-4">
          <div className="text-center text-sm text-gray-600 mb-2">
            Preview (224x224)
          </div>
          <img
            src={cropData}
            alt="Cropped preview"
            className="mx-auto w-56 h-56 object-cover border-2 border-green-600 rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default CropImage;
