import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { Link } from 'react-router-dom';
import { validateLogin } from '../utils/validation';
import useFormValidation from '../utils/useFormValidation';

const Login = () => {
  const navigate = useNavigate();
  const initialState = {
    email: '',
    password: ''
  };

  const handleLoginSubmit = async (formData) => {
    // JWT expects 'username' and 'password', so map email to username
    const response = await axiosInstance.post('/account/token/', {
      username: formData.email,
      password: formData.password,
    });

    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/');
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
  } = useFormValidation(initialState, validateLogin, handleLoginSubmit);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('./src/assets/Signup_background_image.jpg')] bg-cover">
      <div className="w-full max-w-6xl bg-transparent flex flex-col md:flex-row rounded-2xl overflow-hidden ">
        {/* Left Side */}
        <div className="md:w-1/2 w-full bg-transparent px-6 md:px-10 py-10 text-white flex flex-col justify-between">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Sign<br />In.</h1>
          <p className="text-base text-white/80 mb-10 hidden md:block">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </p>
          <p className="text-sm text-white/60">© 20xx Company</p>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 w-full bg-green-100 px-6 md:px-10 py-6 md:py-3 rounded-none md:rounded-l-3xl relative flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-2 text-green-500 text-center md:text-left">Sign In</h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email address</label>
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
            </div>

            {serverError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{serverError}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
              <p className='mt-2 text-center md:text-left'>Don't have an account? <Link to="/signup" className="text-green-500">Sign Up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;