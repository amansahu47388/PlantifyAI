import React, { useState, useEffect } from "react";
import axios from "axios";
import CropImage from "./CropImage";
import Header from "./Header"; // <-- Import your Header component
import axiosInstance from "../utils/axios";

const Dashboard = () => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [showPrediction, setShowPrediction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // Fetch current user email and previous predictions on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile (contains email)
        const userRes = await axiosInstance.get("/account/profile/");
        setUserEmail(userRes.data.user?.email || "");
        // // Fetch previous predictions
        // const historyRes = await axiosInstance.get("/crop-disease/predictions/");
        // setPredictionHistory(historyRes.data);
      } catch (err) {
        setError("Failed to fetch user or prediction history");
      }
    };
    fetchUserData();
  }, []);

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
          email: userEmail,
          time: new Date().toLocaleString(),
          disease: response.data.disease_name,
          confidence: response.data.confidence,
          image_url: URL.createObjectURL(croppedImage),
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
            <form
              onSubmit={handlePredict}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 w-full  mx-auto"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center">Preview & Predict</h3>

              <div className="flex flex-col items-center space-y-3">
                <img
                  src={URL.createObjectURL(croppedImage)}
                  alt="Cropped"
                  className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-md"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-green-600 hover:bg-green-700 text-white font-semibold text-sm sm:text-base py-2 px-5 rounded-md transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="container mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
                  Previous Predictions
                </h2>

                {/* Responsive Table for larger screens */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Serial No</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Time of Input</th>
                        <th className="py-2 px-4 border-b">Diseases</th>
                        <th className="py-2 px-4 border-b">Images</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {predictionHistory.map((prediction, idx) => (
                        <tr key={prediction.id || idx} className="border-b">
                          <td className="py-2 px-4">{idx + 1}</td>
                          <td className="py-2 px-4">{prediction.email}</td>
                          <td className="py-2 px-4">{prediction.time}</td>
                          <td className="py-2 px-4 font-normal mx-auto">{prediction.disease}</td>
                          <td className="py-2 px-4 font-normal mx-auto">
                            <img src={prediction.image_url} alt="Prediction" className="w-16 h-16 object-cover rounded-md" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card layout for smaller screens */}
                <div className="md:hidden space-y-4">
                  {predictionHistory.map((prediction, idx) => (
                    <div
                      key={prediction.id || idx}
                      className="border border-gray-300 rounded-lg p-4 shadow-sm"
                    >
                      <p className="mb-1">
                        <span className="font-semibold">Serial No:</span> {idx + 1}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Email:</span> {prediction.email}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Time of Input:</span> {prediction.time}
                      </p>
                      <p>
                        <span className="font-semibold">Prediction Report:</span> {prediction.disease}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;