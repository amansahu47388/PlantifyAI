export const validateSignup = (formData) => {
  const errors = {};
  // First Name validation
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!formData.first_name.trim()) {
    errors.first_name = 'First name is required';
  } else if (formData.first_name.length < 2) {
    errors.first_name = 'First name must be at least 2 characters';
  } else if (!nameRegex.test(formData.first_name)) {
    errors.first_name = 'Please enter a valid first name';
  }

  // Last Name validation
  if (!formData.last_name.trim()) {
    errors.last_name = 'Last name is required';
  } else if (formData.last_name.length < 2) {
    errors.last_name = 'Last name must be at least 2 characters';
  } else if (!nameRegex.test(formData.last_name)) {
    errors.last_name = 'Please enter a valid last name';
  }
  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const consecutiveDotsRegex = /\.{2,}/;
  const maxEmailLength = 254; // RFC 5321
  const maxLocalPartLength = 64; // RFC 5321
  const validTLDs = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'io', 'co', 'uk', 'us', 'ca', 'au', 'in']; // Add more as needed
  
  if (!formData.email) {
    errors.email = 'Email is required';
  } else {
    const [localPart, domain] = formData.email.split('@');
    
    if (formData.email.length > maxEmailLength) {
      errors.email = 'Email is too long (maximum 254 characters)';
    } else if (localPart.length > maxLocalPartLength) {
      errors.email = 'Local part of email is too long (maximum 64 characters)';
    } else if (consecutiveDotsRegex.test(formData.email)) {
      errors.email = 'Email cannot contain consecutive dots';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format. Please use only letters, numbers, and common special characters';
    } else if (localPart.startsWith('.') || localPart.endsWith('.')) {
      errors.email = 'Email cannot start or end with a dot';
    } else if (domain) {
      const tld = domain.split('.').pop().toLowerCase();
      if (!validTLDs.includes(tld)) {
        errors.email = 'Invalid or unsupported email domain';
      } else {
        // Check for common disposable email domains
        const disposableDomains = ['tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com', 'yopmail.com'];
        if (disposableDomains.includes(domain.toLowerCase())) {
          errors.email = 'Please use a valid permanent email address';
        }
      }
    }
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Confirm Password validation
  if (!formData.password2) {
    errors.password2 = 'Please confirm your password';
  } else if (formData.password !== formData.password2) {
    errors.password2 = 'Passwords do not match';
  }

  return errors;
};

export const validateLogin = (formData) => {
  const errors = {};
  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const consecutiveDotsRegex = /\.{2,}/;
  const maxEmailLength = 254; // RFC 5321
  const maxLocalPartLength = 64; // RFC 5321
  const validTLDs = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'io', 'co', 'uk', 'us', 'ca', 'au', 'in']; // Add more as needed
  
  if (!formData.email) {
    errors.email = 'Email is required';
  } else {
    const [localPart, domain] = formData.email.split('@');
    
    if (formData.email.length > maxEmailLength) {
      errors.email = 'Email is too long (maximum 254 characters)';
    } else if (localPart.length > maxLocalPartLength) {
      errors.email = 'Local part of email is too long (maximum 64 characters)';
    } else if (consecutiveDotsRegex.test(formData.email)) {
      errors.email = 'Email cannot contain consecutive dots';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format. Please use only letters, numbers, and common special characters';
    } else if (localPart.startsWith('.') || localPart.endsWith('.')) {
      errors.email = 'Email cannot start or end with a dot';
    } else if (domain) {
      const tld = domain.split('.').pop().toLowerCase();
      if (!validTLDs.includes(tld)) {
        errors.email = 'Invalid or unsupported email domain';
      }
    }
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return errors;
};