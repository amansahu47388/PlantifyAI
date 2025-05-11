# Email Verification System - PlantifyAI

## Overview

This document explains how the email verification system works in PlantifyAI and how to configure it for both development and production environments.

## How it Works

1. **User Registration**:

   - When a user registers, a 6-digit OTP (One-Time Password) is generated
   - The OTP is stored in the database with a 10-minute expiration time
   - An email containing the OTP is sent to the user's email address

2. **Verification Process**:

   - The user is redirected to the OTP verification page
   - The user enters the 6-digit code received via email
   - If the code matches and has not expired, the user's email is marked as verified
   - The user can then proceed to login

3. **Resend Functionality**:
   - If the user doesn't receive the email or the OTP expires, they can request a new one
   - Previous OTPs are invalidated when a new one is generated
   - A cooldown period of 60 seconds is enforced between resend requests

## Development Environment

In the development environment, emails are not actually sent to users. Instead:

1. The OTP is printed to the console with a clear format:

   ```
   ==================================================
   📧 VERIFICATION EMAIL FOR: user@example.com
   📟 OTP CODE: 123456
   ==================================================
   ```

2. The OTP is also included in the API response when `DEBUG=True`:
   ```json
   {
     "success": "User registered successfully",
     "data": {
       "user_id": 1,
       "email": "user@example.com",
       "first_name": "John",
       "last_name": "Doe",
       "requires_verification": true,
       "email_sent": true,
       "development_otp": "123456",
       "note": "This OTP is only included in DEBUG mode"
     }
   }
   ```

## Production Configuration

### Using Environment Variables

The email configuration now uses environment variables. You can:

1. Create a `.env` file in the `Backend/Plantify` directory using `email_config.example` as a template
2. Set the environment variables directly in your server environment

Example configuration:

```
# Use SMTP backend for actual sending
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=PlantifyAI <noreply@plantifyai.com>
```

### Email Service Options

You can use various email services:

#### Gmail

- Gmail requires creating an "App Password"
- Go to your Google Account > Security > 2-Step Verification > App passwords
- Use this app password in EMAIL_HOST_PASSWORD

#### Transactional Email Services

Other options include:

- SendGrid
- Mailgun
- Amazon SES
- Postmark

### Fallback Mechanism

A fallback mechanism has been implemented that:

1. First tries to send email using Django's built-in method
2. If that fails, attempts direct SMTP connection
3. Always provides clear console output in development mode

## Testing

You can test the email verification system by:

1. Registering a new user
2. Checking the console output or API response for the OTP
3. Using the OTP in the verification page
4. Trying to login after successful verification

### Testing SMTP directly

You can test your SMTP settings with a Python shell:

```python
from Account.utils import send_otp_email
success = send_otp_email('test@example.com', '123456')
print(f"Email sent: {success}")
```

## Troubleshooting

If emails are not being sent in production:

1. Check your SMTP settings (host, port, TLS/SSL)
2. Verify your credentials are correct
3. Check if your email provider requires additional setup (e.g., allowing less secure apps)
4. Review the server logs for specific errors
5. Check the email service provider's dashboard for sending limits or blocked emails

Common Gmail issues:

- Make sure 2FA is enabled and you're using an App Password
- Make sure "Less secure app access" is turned on if using a regular password
- Check if your account has sending limits

For development issues, ensure the console output is visible and check the API responses.
