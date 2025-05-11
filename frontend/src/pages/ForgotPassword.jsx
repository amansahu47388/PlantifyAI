import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/account/password-reset/request/', { email });
      setMessage(response.data.success);
      setIsSubmitted(true);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.error || 
        error.response?.data?.email?.[0] || 
        'Something went wrong. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('./src/assets/Signup_background_image.jpg')] bg-cover">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Reset Your Password</h2>
        
        {isSubmitted ? (
          <div className="text-center">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
              <p>{message}</p>
            </div>
            <p className="mb-4">Please check your email for instructions to reset your password.</p>
            <Link 
              to="/login" 
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            {message && (
              <div 
                className={`${isError ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'} border-l-4 p-4 mb-6`} 
                role="alert"
              >
                <p>{message}</p>
              </div>
            )}
            
            <p className="mb-6 text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <button
                  type="submit"
                  className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
              
              <div className="text-center mt-8">
                <Link to="/login" className="text-sm text-green-600 hover:text-green-800">
                  Return to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 