import React from "react";
import 'remixicon/fonts/remixicon.css'
const Profile = () => {
  return (

    <div className="min-h-screen bg-gradient-to-r from-green-500  to-green-300 flex ">
      {/* Sidebar */}


      {/* Main Content */}
      <div className="flex-1 flex flex-col mx-auto justify-around  mt-10">
        {/* Topbar */}


        {/* Profile Section */}
        <main className="flex-1    md:p-8 w-[70%]  mx-auto ">
          <div className="bg-white rounded-xl shadow-md p-4 ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src="/src/assets/logo.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="font-semibold sm:font-normal text-gray-700">Alexa Rawles</h2>
                  <p className="text-sm sm:text-md md:text-lg lg:text-xl text-gray-400 sm:font-extralight font-light">
                    alexarawles@gmail.com
                  </p>
                </div>
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 md:mt-0">
                Edit
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["First Name", "Your First Name"],
                ["Last Name", "Your First Name"],
                ["Last Name", "Your First Name"],
                ["Gender", "Your First Name"],
                ["date_joined", "Your Date of Joinded"],


              ].map(([label, placeholder]) => (
                <div key={label}>
                  <label className="text-gray-600 text-sm">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full mt-1 p-2 border rounded-md text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Email Section */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-700 mb-2">My email Address</h3>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-500">📧</span>
                </div>
                <div>
                  <p className="text-gray-700 text-sm">alexarawles@gmail.com</p>
                  <p className="text-gray-400 text-xs">1 month ago</p>
                </div>
              </div>
              <button className="mt-4 text-green-500 text-sm bg-blue-50 px-6 py-2 rounded-md">
                Save
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}



export default Profile;