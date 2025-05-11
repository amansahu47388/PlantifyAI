import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });

  // Extract token from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    
    if (!tokenFromUrl) {
      setIsError(true);
      setMessage('No reset token provided. Please request a new password reset link.');
      setIsVerifying(false);
      return;
    }
    
    setToken(tokenFromUrl);
    verifyToken(tokenFromUrl);
  }, [location]);

  // Verify token with backend
  const verifyToken = async (tokenValue) => {
    setIsVerifying(true);
    
    try {
      await axiosInstance.post('/account/password-reset/verify/', { token: tokenValue });
      setIsTokenValid(true);
      setIsVerifying(false);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.token?.[0] || 
        error.response?.data?.error || 
        'Invalid or expired token. Please request a new password reset link.'
      );
      setIsTokenValid(false);
      setIsVerifying(false);
    }
  };

  // Check password strength in real-time
  const checkPasswordStrength = async (newPassword) => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, feedback: [] });
      return;
    }
    
    try {
      const response = await axiosInstance.post('/account/check-password-strength/', { password: newPassword });
      setPasswordStrength(response.data);
    } catch (error) {
      console.error('Error checking password strength:', error);
    }
  };

  // Handle password change with strength check
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    if (password !== password2) {
      setIsError(true);
      setMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/account/password-reset/confirm/', {
        token,
        password,
        password2
      });
      
      setMessage(response.data.success);
      setIsResetComplete(true);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.password?.[0] || 
        error.response?.data?.token?.[0] || 
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.error || 
        'Something went wrong. Please try again.'
      );
      setIsLoading(false);
    }
  };

  // Get color for password strength indicator
  const getStrengthColor = (score) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Verifying Reset Link</h2>
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
          <p className="text-gray-600">Please wait while we verify your reset token...</p>
        </div>
      </div>
    );
  }

  // Token invalid state
  if (!isTokenValid && !isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('./src/assets/Signup_background_image.jpg')] bg-cover">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Invalid Reset Link</h2>
          
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{message}</p>
          </div>
          
          <div className="text-center">
            <Link to="/forgot-password" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 mb-4">
              Request New Reset Link
            </Link>
            
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Reset complete state
  if (isResetComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Password Reset Complete</h2>
          
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>{message}</p>
          </div>
          
          <p className="mb-6 text-center text-gray-600">
            Your password has been successfully reset. You can now login with your new password.
          </p>
          
          <div className="text-center">
            <Link to="/login" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150">
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default state - form for resetting password
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Reset Your Password</h2>
        
        {message && (
          <div 
            className={`${isError ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'} border-l-4 p-4 mb-6`} 
            role="alert"
          >
            <p>{message}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              minLength="8"
            />
            
            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getStrengthColor(passwordStrength.score)}`} 
                    style={{ width: `${passwordStrength.score}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm">
                  {passwordStrength.feedback?.map((feedback, index) => (
                    <p key={index} className="text-gray-600">{feedback}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password2" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm New Password
            </label>
            <input
              id="password2"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              minLength="8"
            />
            {password2 && password !== password2 && (
              <p className="text-red-500 text-xs italic mt-1">Passwords do not match</p>
            )}
          </div>
          
          <div className="mb-6">
            <button
              type="submit"
              disabled={isLoading || password !== password2 || password.length === 0 || (passwordStrength.score < 40)}
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ${
                (isLoading || password !== password2 || password.length === 0 || (passwordStrength.score < 40)) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">
              Return to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 