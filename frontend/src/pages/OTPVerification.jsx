import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);
  
  // Initialize refs for each input
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);
  
  // Set email from URL params or location state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // No email provided, redirect to signup
      navigate('/signup');
    }
  }, [location, navigate]);
  
  // Handle countdown timer for resend button
  useEffect(() => {
    let interval = null;
    
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
    
    return () => clearInterval(interval);
  }, [timer, canResend]);
  
  // Handle input change for OTP fields
  const handleChange = (index, e) => {
    const value = e.target.value;
    
    if (isNaN(value)) return; // Only allow numbers
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value.substr(0, 1); // Only take the first digit
    setOtp(newOtp);
    
    // If input is filled, move to next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle key press for OTP fields (for backspace handling)
  const handleKeyDown = (index, e) => {
    // If backspace and current field is empty, move to previous field
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Handle OTP verification
  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.post('/account/verify-otp/', {
        email,
        otp: otpString
      });
      
      if (response.data.success) {
        // If verification successful and tokens provided, save them
        if (response.data.data?.access) {
          localStorage.setItem('access_token', response.data.data.access);
          localStorage.setItem('refresh_token', response.data.data.refresh);
        }
        
        // Redirect to login page with success message
        navigate('/login', { 
          state: { 
            verified: true,
            message: 'Email verified successfully! You can now log in.' 
          } 
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle resending OTP
  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.post('/account/resend-otp/', {
        email
      });
      
      if (response.data.success) {
        // Reset timer and disable resend button
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend verification code.');
    } finally {
      setResendLoading(false);
    }
  };
  
  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('./src/assets/Signup_background_image.jpg')] bg-cover">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Verify Your Email</h2>
          <p className="text-center text-gray-600 mb-6">
            We've sent a verification code to<br />
            <span className="font-semibold">{email}</span>
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Didn't receive the code?{' '}
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <span className="text-gray-500">
                  Resend in {timer} seconds
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 