import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSave, FaCamera, FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axiosInstance.get('/account/profile/');
      if (response.data) {
        setProfile(response.data);
        setEditedProfile(response.data);
        setError('');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.error || 'Failed to fetch profile data');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested objects (user.first_name, user.last_name, etc.)
      const [parent, child] = name.split('.');
      setEditedProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size cannot exceed 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      const formData = new FormData();
      formData.append('profile_image', file);

      try {
        setLoading(true);
        const response = await axiosInstance.put('/account/profile/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data) {
          setProfile(response.data);
          setEditedProfile(response.data);
          setError('');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to update profile image');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      // Format the data to match backend expectations
      const formData = {
        // User related fields
        first_name: editedProfile?.user?.first_name || '',
        last_name: editedProfile?.user?.last_name || '',
        // Profile fields
        bio: editedProfile?.bio || '',
        phone: editedProfile?.phone || '',
        address: editedProfile?.address || '',
        dob: editedProfile?.dob || null
      };

      const response = await axiosInstance.put('/account/profile/', formData);

      if (response.data) {
        setProfile(response.data);
        setIsEditing(false);
        setError('');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <main className="flex-1 p-4 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Personal information</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2 relative">
              <div className="relative group">
                {editedProfile?.image_url && !imageError ? (
                  <img
                    src={editedProfile.image_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow flex items-center justify-center bg-gray-50">
                    <FaUserCircle className="text-green-600 text-5xl" />
                  </div>
                )}
                {isEditing && (
                  <div
                    onClick={handleImageClick}
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaCamera className="text-white text-2xl" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-1">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="user.first_name"
                  value={editedProfile?.user?.first_name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              ) : (
                <div className="w-full border border-gray-200 rounded-md px-4 py-2 bg-gray-100">
                  {profile?.user?.first_name || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="user.last_name"
                  value={editedProfile?.user?.last_name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              ) : (
                <div className="w-full border border-gray-200 rounded-md px-4 py-2 bg-gray-100">
                  {profile?.user?.last_name || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Email Address</label>
              <div className="w-full border border-gray-200 rounded-md px-4 py-2 bg-gray-100">
                {profile?.user?.email || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editedProfile?.phone || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              ) : (
                <div className="w-full border border-gray-200 rounded-md px-4 py-2 bg-gray-100">
                  {profile?.phone || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editedProfile?.address || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              ) : (
                <div className="w-full border border-gray-200 rounded-md px-4 py-2 bg-gray-100">
                  {profile?.address || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={editedProfile?.dob || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              ) : (
                <div className="w-full border border-gray-200 rounded-md px-4 py-2 bg-gray-100">
                  {profile?.dob || 'Not set'}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-600 mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedProfile?.bio || ''}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              ) : (
                <div className="w-full border border-gray-200 rounded-md px-4 py-2 bg-gray-100">
                  {profile?.bio || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="mr-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                <FaSave /> Save Changes
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
