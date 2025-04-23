import React from "react";
const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-500 p-4">
      <h1 className="font-bold text-4xl text-white mb-5">Contact Us</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row max-w-4xl w-full">
        {/* Left Image Section */}
        <div className="md:w-1/2 w-full">
          <img
            src="\src\assets\contact-us.svg" // Replace with your image path
            alt="Building"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2 w-full p-8">
          <h2 className="text-2xl font-semibold mb-6">
            <span className="text-green-500">Let's</span> Talk to you
          </h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <textarea
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-green-400"
            ></textarea>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Contact Us
            </button>
          </form>
        </div>
      </div>
    </div>
  );


}
export default Contact;