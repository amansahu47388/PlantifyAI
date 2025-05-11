import { useState, useEffect } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} initialState - Initial form data
 * @param {Function} validate - Validation function that returns errors
 * @param {Function} onSubmit - Function to run on successful form submission
 * @returns {Object} - Form state, errors, handle change, handle submit, and loading state
 */
export const useFormValidation = (initialState, validate, onSubmit) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Validate when form data changes and the field has been touched
  useEffect(() => {
    const validationErrors = validate(formData);
    const touchedErrors = Object.keys(validationErrors).reduce((acc, key) => {
      if (touched[key]) {
        acc[key] = validationErrors[key];
      }
      return acc;
    }, {});
    
    setErrors(touchedErrors);
  }, [formData, touched, validate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Mark field as touched when user interacts with it
    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');
    
    // Validate all fields on submit
    setTouched(Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
    
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        await onSubmit(formData);
      } catch (err) {
        setServerError(err.response?.data?.error || err.response?.data?.detail || 'An error occurred');
      }
    }
    
    setIsSubmitting(false);
  };

  return {
    formData,
    errors,
    serverError,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormData,
    setServerError
  };
};

export default useFormValidation; 