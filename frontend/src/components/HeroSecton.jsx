import React from "react";
import video from "../assets/video.mp4";
// import Navbar from "../components/Header";
import { Link } from 'react-router-dom';
// import Footer from "../components/Footer";

const HeroSection = () => {
  return (
    <div className="main">
      <div className="overlay"></div>
      <video src={video} autoPlay loop muted />

      <div className="content ">
        <h1 className="heading">Welcome to Plantify <br></br> choose the better Crop</h1>

      </div>
      <div className="content flex  items-between mt-50" >
        <Link to="/prediction" className=" px-12 py-5  bg-green-400 border-green-400 rounded bg-green text-white  transition hover:bg-green-500 border-0">Do The Predictions of crop deseases</Link>

      </div>
    </div>
  );
};


export default HeroSection;