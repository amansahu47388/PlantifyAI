import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    bio: '',
    profileImage: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch user data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await axios.get('http://127.0.0.1:8000/account/profile/', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });
        const data = response.data.data;
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.location || '',
          date_of_birth: data.birth_date || '',
          bio: data.bio || '',
          profileImage: data.image || '',
        });
        setImagePreview(data.image || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditMode((prev) => !prev);
    setSuccess(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errors.email = 'Valid email required';
    if (!formData.phone) errors.phone = 'Phone is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
    if (!formData.profileImage) errors.profileImage = 'Profile image is required';
    if (!formData.bio) errors.bio = 'Bio is required';
    return errors;
  };

  const handleFieldBlur = (e) => {
    const { name } = e.target;
    const errors = validate();
    setFormErrors((prev) => ({ ...prev, [name]: errors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await axios.put('http://127.0.0.1:8000/account/profile/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.date_of_birth,
        bio: formData.bio,
        profile_image: formData.profileImage,
      });
      setSuccess(true);
      setEditMode(false);
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Edit Profile Button */}
      <button
        className="absolute top-6 right-6 z-20 bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition"
        onClick={handleEditClick}
        type="button"
      >
        {editMode ? 'Cancel' : 'Edit Profile'}
      </button>

      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-lg font-semibold mb-6">User profile management</h2>
        <nav className="space-y-3">
          <div className="font-semibold text-blue-600 bg-blue-50 rounded px-3 py-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
            Personal Info
          </div>
          <div className="text-gray-600 px-3 py-2">Emails &amp; Password</div>
          <div className="text-gray-600 px-3 py-2">Notifications</div>
          <div className="text-gray-600 px-3 py-2">Businesses</div>
          <div className="text-gray-600 px-3 py-2">Integration</div>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
          <h1 className="text-2xl font-bold">Personal information</h1>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2 relative">
              <img
                src={imagePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
              />
              {editMode && (
                <label className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100 transition border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-600 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleFieldBlur}
                className={`w-full border ${formErrors.firstName ? 'border-red-400' : 'border-gray-200'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200`}
                disabled={!editMode}
              />
              {formErrors.firstName && <div className="text-red-500 text-xs">{formErrors.firstName}</div>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleFieldBlur}
                className={`w-full border ${formErrors.lastName ? 'border-red-400' : 'border-gray-200'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200`}
                disabled={!editMode}
              />
              {formErrors.lastName && <div className="text-red-500 text-xs">{formErrors.lastName}</div>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleFieldBlur}
                className={`w-full border ${formErrors.email ? 'border-red-400' : 'border-gray-200'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200`}
                disabled={!editMode}
              />
              {formErrors.email && <div className="text-red-500 text-xs">{formErrors.email}</div>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Phone Number</label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleFieldBlur}
                className={`w-full border ${formErrors.phone ? 'border-red-400' : 'border-gray-200'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200`}
                disabled={!editMode}
              />
              {formErrors.phone && <div className="text-red-500 text-xs">{formErrors.phone}</div>}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleFieldBlur}
                className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                onBlur={handleFieldBlur}
                className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Bio</label>
              <textarea
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                onBlur={handleFieldBlur}
                className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                disabled={!editMode}
              />
            </div>
          </form>
        </div>
        {/* Save Button Bottom Right */}
        {editMode && (
          <button
            type="submit"
            form="profile-form"
            disabled={saving}
            className="fixed bottom-8 right-8 z-30 bg-green-500 text-white px-8 py-3 rounded-md shadow-lg hover:bg-green-600 transition disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </main>
    </div>
  );
};

export default Profile;