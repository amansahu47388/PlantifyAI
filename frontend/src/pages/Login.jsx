import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { Link } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/account/login/', formData);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.data.token);

        // Redirect to dashboard
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

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
                  className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <p className='mt-2 text-center md:text-left'>Already have an Account? <Link to="/signup" className="text-green-500">Sign Up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;