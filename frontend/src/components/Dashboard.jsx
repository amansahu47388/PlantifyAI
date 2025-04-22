import React, { useState } from "react";
import axios from "axios";
import CropImage from "./CropImage";
import Header from "./Header"; // <-- Import your Header component

const Dashboard = () => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveCroppedImage = (blob) => {
    setCroppedImage(blob);
    setShowPrediction(false);
    setError(null);
  };

  const handlePredict = async (event) => {
    event.preventDefault();
    if (!croppedImage) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", croppedImage, "cropped_image.jpg");

    try {
      const response = await axios.post(
        "http://localhost:8000/crop-disease/predict/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPredictionResult(response.data);
      setPredictionHistory([
        {
          id: predictionHistory.length + 1,
          email: response.data.email,
          time: new Date().toLocaleString(),
          disease: response.data.disease_name,
          confidence: response.data.confidence,
        },
        ...predictionHistory,
      ]);
      setShowPrediction(true);
    } catch (error) {
      console.error("Error predicting disease:", error);
      setError(error.response?.data?.error || "Error predicting disease");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-165  bg-[url('./src/assets/pexels-karoldach-409696.jpg')] bg-cover">
    <div className=" pt-20 min-h-screen ">
      
      {<Header />}
      

      <div className="container mx-auto p-6">
      
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-green-600 text-center">
            Plant Disease Detection
          </h2>
          <CropImage saveCroppedImage={saveCroppedImage} />
        </div>

        {croppedImage && (
          <form onSubmit={handlePredict} className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Preview & Predict</h3>
            <div className="flex flex-col items-center">
              <img
                src={URL.createObjectURL(croppedImage)}
                alt="Cropped"
                className="w-48 h-48 object-cover mb-4 rounded-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Analyzing..." : "Predict Disease"}
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        )}

        {showPrediction && predictionResult && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Prediction Result</h3>
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-semibold">Disease:</span> {predictionResult.disease_name}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Confidence:</span> {predictionResult.confidence}%
              </p>
            </div>
          </div>
        )}

        {predictionHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="container mx-auto p-6">
              <h2 className="text-2xl font-bold mb-2">Previous Predictions</h2>
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Serial No</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Time of Input</th>
                    <th className="py-2 px-4 border-b">Prediction Report</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {predictionHistory.map((prediction) => (
                    <tr key={prediction.id} className="border-b">
                      <td className="py-2 px-4">{prediction.id}</td>
                      <td className="py-2 px-4">{prediction.email}</td>
                      <td className="py-2 px-4">{prediction.time}</td>
                      <td className="py-2 px-4">{prediction.disease}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
