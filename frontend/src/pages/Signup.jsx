import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { Link } from 'react-router-dom';
import { validateSignup } from '../utils/validation';
import useFormValidation from '../utils/useFormValidation';

const Signup = () => {
  const navigate = useNavigate();
  const initialState = {
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  };

  const handleSignupSubmit = async (formData) => {
    const response = await axiosInstance.post('/account/register/', formData);
    if (response.data.success) {
      // Check if email verification is required
      if (response.data.data?.requires_verification) {
        // Redirect to OTP verification page
        navigate('/verify-otp', { 
          state: { email: formData.email } 
        });
      } else {
        // Directly redirect to login
        navigate('/login', { 
          state: { 
            registered: true,
            message: 'Registration successful! You can now log in.' 
          } 
        });
      }
    }
    return response;
  };

  const {
    formData,
    errors,
    serverError,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation(initialState, validateSignup, handleSignupSubmit);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('./src/assets/Signup_background_image.jpg')] bg-cover">
      <div className="w-full max-w-6xl bg-transparent flex flex-col md:flex-row rounded-2xl overflow-hidden ">
        {/* Left Side */}
        <div className="md:w-1/2 w-full bg-transparent px-6 md:px-10 py-10 text-white">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Sign<br />Up.</h1>
          <p className="text-base text-white/80 mb-10 hidden md:block">
           Beyond identification, Plantify offers an AI assistant that not only names your plant but also provides guidance on care, warns about potential diseases, and suggests treatment options. This interactive experience sets Plantify apart, making it a valuable tool for plant enthusiasts. 

          </p>
          <p className="text-sm text-white/60">© Plantify-AI</p>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 w-full bg-green-100 px-6 md:px-10 py-6 md:py-3 rounded-none md:rounded-l-3xl relative">
          <h2 className="text-2xl font-semibold mb-2 text-green-500 text-center md:text-left">Sign Up</h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {serverError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{serverError}</span>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="first_name" className="block text-gray-700">First Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  className={`w-full px-4 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="last_name" className="block text-gray-700">Last Name</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  className={`w-full px-4 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="password2" className="block text-gray-700">Confirm Password</label>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  required
                  className={`w-full px-4 py-2 border ${errors.password2 ? 'border-red-500' : 'border-gray-400'} rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400`}
                  placeholder="Confirm Password"
                  value={formData.password2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password2 && <p className="text-red-500 text-xs mt-1">{errors.password2}</p>}
              </div>
            </div>
            <div className="mb-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
              <p className='mt-4 text-center md:text-left'>Already have an Account? <Link to="/login" className="text-green-600">Sign In</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
