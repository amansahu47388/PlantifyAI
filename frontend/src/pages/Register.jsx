import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
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
      const response = await axiosInstance.post('/account/register/', formData);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.data.token);

        // Redirect to login or dashboard
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">

            <div className="mb-4">
              <label htmlFor="first_name" className="rounded-md shadow-sm -space-y-px">First Name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className=" w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="last_name" className="rounded-md shadow-sm -space-y-px">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                className=" w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className=" w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="rounded-md shadow-sm -space-y-px">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className=" w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password2" className="rounded-md shadow-sm -space-y-px">Confirm Password</label>
              <input
                id="password2"
                name="password2"
                type="password"
                required
                className=" w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className='mt-2'>Already have an Account? <Link to="/login" className="text-blue-600">Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register