import React from "react";
 import 'remixicon/fonts/remixicon.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
const About=()=>{
    return(
        <div>
            <Header/>
            <div className="h-screen  main">
                <div class="overlay"></div>
                <div className=" h-100  bg-[url('./src/assets/pexels-pixabay-86397.jpg')] bg-cover">
                    {/* <h1 className="text-white pt-4 text-center  text-3xl font-semibold">Plantify</h1> */}

                    <h2 className="text-white pt-20 text-center  text-2xl font-semibold sm:text-4xl ">Try our AI Powerd <br></br> Disease Detection</h2>
                    < button className=" flex  px-6 bg-gray-200 mt-20 mx-auto mb-5    py-2 text-black  rounded hover:bg-green-600 transition duration-300"><i className="ri-download-cloud-fill pr-2"></i>Try Now</button>
                </div>
                <div class="overlay"></div>
                <div className="  bg-gradient-to-t to-lime-600 sm:items-start h-full md:h-full from-black">
                    <h1 className="text-white pt-4 text-center  text-3xl font-semibold">How it works?</h1>
                    <div className="flex justify-around flex-wrap gap-5 items-center">
                        <div className="flex flex-col justify-around mb-14">
                            <i className="ri-camera-line size-10 text-gray-200 text-4xl text-center "></i>
                            <i className="ri-number-1 ml-1 bg-gray-200 rounded-4xl size-8 text-xl text-center p-1 m-3 "></i>
                            <h2 className="text-white font-semibold">Click a Pic </h2>
                            <p className="text-white text-sm ">Take a Picture of your Plant Leaf</p>
                        </div>
                        <div className="flex flex-col justify-around">
                            <i class="ri-upload-cloud-fill size-10 text-gray-200 text-4xl"></i>
                            <i className="ri-number-2 ml-1 bg-gray-200 rounded-4xl size-8 text-xl text-center p-1 m-3"></i>
                            <h2 className="text-white font-semibold">Upload on your Plant AI </h2>
                            <p className="text-white text-sm">Visit plant AI on your divice <br></br>and click on try Now to Uplaod <br></br>Your picture</p>

                        </div>
                        <div className="flex flex-col justify-around">
                            <i class="ri-list-check size-10 text-gray-200 text-4xl"></i>
                            <i className="ri-number-3  ml-1 bg-gray-200 rounded-4xl size-8 text-xl text-center p-1 m-3"></i>
                            <h2 className="text-white font-semibold">Get final Report </h2>
                            <p className="text-white text-sm">Plant AI will analyze Your plant<br></br>and will display a Detailed  <br></br>Report for you</p>

                        </div>
                    </div>

                    {/* <h2 className="text-white pt-20 text-center  text-2xl font-semibold sm:text-4xl ">Try our AI Powerd <br></br> Disease Detection</h2>
                  < button className="px-6 bg-green-300 mt-20 ml-147 mb-5   py-2 text-black  rounded hover:bg-green-600 transition duration-300">Try Now</button>        */}
                </div>
            </div>
            <Footer/>
        </div>
    )
}
export default About;