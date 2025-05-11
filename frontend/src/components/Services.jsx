import React from 'react';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
const Services = () => {
  return (
    <div id='services' className="bg-white flex flex-col items-center justify-center py-10">
      <h1 className="font-bold text-4xl text-green-500">Our Services</h1>
      <div className="flex flex-wrap justify-center gap-6 p-4 sm:m-10">
        <Card sx={{ maxWidth: 345 }} className="w-full sm:w-[300px] md:w-[345px] ">

          <img src="\src\assets\CD.png" className="w-full h-45 object-cover p-2  rounded-lg" alt="example" />


          <div className=" w-full h-full  bg-gray-100">

            <h1 className="text-center p-4 text-xl font-serif font-medium ">
              Crop Diseases Prediction
            </h1>
            <p className=" text-sm mb-10 px-5  text-justify">
              The purpose of crop disease prediction is to help farmers detect and
              prevent crop diseases at an early stage to minimize crop loss and
              improve agricultural productivity.
            </p>
            <div className="flex gap-5 align-bottom mb-5 ml-2">
              < Link to="/dashboard" className="px-5  bg-green-500 text-white py-2   rounded hover:bg-green-600 transition duration-300">Visit </Link>
              < button className="px-5 bg-green-500 text-white py-2  rounded hover:bg-green-600 transition duration-300">Learn More</button>
            </div>

          </div>
        </Card>

        <Card sx={{ maxWidth: 345 }} className="w-full sm:w-[300px] md:w-[345px]">

          <img src="\src\assets\WhatsApp Image 2025-04-24 at 22.38.09_02887219.jpg" className="w-full h-45 object-cover  p-2   rounded-lg" alt="example" />

          <div className=" w-full h-full  bg-gray-100">

            <h1 className="text-center p-4 text-xl font-serif font-medium  ">
              Crop Recommendation System
            </h1>
            <p className=" text-sm mb-10 px-5 text-justify">
              A crop recommendation system provides suggestions on the most suitable crops to grow
              in a specific area based on various factors such as
              soil properties, weather conditions.
            </p>
            <div className="flex gap-5 align-bottom mb-5 ml-2">
              < button className="px-5 bg-green-500 text-white py-2   rounded hover:bg-green-600 transition duration-300">Visit </button>
              < button className="px-5 bg-green-500 text-white py-2  rounded hover:bg-green-600 transition duration-300">Learn More</button>
            </div>

          </div>
        </Card>

        <Card sx={{ maxWidth: 345 }} className="w-full sm:w-[300px]  md:w-[345px]  sm:h-[250px] md:h-[450px] ">

          <img src="\src\assets\app.jpg" className="w-full h-45 object-cover  p-2   rounded-lg" alt="example" />
          <div className=" w-full h-full bg-gray-100">

            <h2 className="text-center p-4 text-xl font-serif font-medium ">
              Crop Deseases Prediction App
            </h2>
            <p className=" text-sm mb-10 px-5">
              The purpose of crop disease prediction is to help farmers detect and
              prevent crop diseases at an early stage to minimize crop loss and
              improve agricultural productivity.
            </p>
            <div className="flex gap-5 align-bottom mb-5 ml-2 ">
              < button className="px-5 bg-green-500 text-white py-2   rounded hover:bg-green-600 transition duration-300">Visit </button>
              < button className="px-5 bg-green-500 text-white py-2  rounded hover:bg-green-600 transition duration-300">Learn More</button>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
};

export default Services;