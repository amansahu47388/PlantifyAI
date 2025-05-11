import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings
from django.core.mail import send_mail
import logging
import os
import re
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

def send_email_with_fallback(subject, message, recipient_email, html_message=None):
    """
    Send an email with fallback options if the primary method fails.
    
    Args:
        subject (str): Email subject
        message (str): Email plain text message
        recipient_email (str): Recipient's email address
        html_message (str, optional): HTML version of the message
        
    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    # Always log the email in development mode
    if settings.DEBUG:
        print("\n" + "="*50)
        print(f"📧 EMAIL FOR: {recipient_email}")
        print(f"📑 SUBJECT: {subject}")
        print(f"📝 MESSAGE: {message}")
        print("="*50 + "\n")
    
    # Try primary Django email sending method
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Email sent to {recipient_email} successfully")
        return True
    except Exception as e:
        logger.error(f"Primary email method failed: {str(e)}")
        
        # Fallback to direct SMTP if Django's method fails
        return send_email_direct_smtp(subject, message, recipient_email, html_message)


def send_email_direct_smtp(subject, message, recipient_email, html_message=None):
    """
    Fallback method to send email directly via SMTP if Django's method fails.
    """
    # Default to these environment variables if available, otherwise use settings
    smtp_host = os.environ.get('EMAIL_HOST', getattr(settings, 'EMAIL_HOST', None))
    smtp_port = os.environ.get('EMAIL_PORT', getattr(settings, 'EMAIL_PORT', 587))
    smtp_user = os.environ.get('EMAIL_HOST_USER', getattr(settings, 'EMAIL_HOST_USER', None))
    smtp_password = os.environ.get('EMAIL_HOST_PASSWORD', getattr(settings, 'EMAIL_HOST_PASSWORD', None))
    sender_email = os.environ.get('DEFAULT_FROM_EMAIL', getattr(settings, 'DEFAULT_FROM_EMAIL', None))
    
    # Quick validation to avoid attempts with missing config
    if not all([smtp_host, smtp_port, smtp_user, smtp_password, sender_email]):
        logger.error("Email configuration is incomplete. Cannot send email.")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = recipient_email
        
        # Add plain text part
        text_part = MIMEText(message, 'plain')
        msg.attach(text_part)
        
        # Add HTML part if provided
        if html_message:
            html_part = MIMEText(html_message, 'html')
            msg.attach(html_part)
        
        # Connect to SMTP server and send the email
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
            
        logger.info(f"Email sent to {recipient_email} successfully via direct SMTP")
        return True
    
    except Exception as e:
        logger.error(f"Failed to send email via direct SMTP: {str(e)}")
        return False


def send_otp_email(email, otp):
    """
    Send OTP verification email
    """
    subject = 'Verify your PlantifyAI account'
    plain_message = f"""
Hello,

Your verification code for PlantifyAI is: {otp}

This code is valid for 10 minutes.

Thank you,
PlantifyAI Team
"""
    
    html_message = f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2e7d32;">PlantifyAI</h1>
        </div>
        <p>Hello,</p>
        <p>Your verification code for PlantifyAI is:</p>
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0; border-radius: 4px;">
            {otp}
        </div>
        <p>This code is valid for <strong>10 minutes</strong>.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <p>Thank you,<br>PlantifyAI Team</p>
    </div>
</body>
</html>
"""
    
    return send_email_with_fallback(subject, plain_message, email, html_message)

def validate_password_strength(password):
    """
    Validates password strength according to settings.PASSWORD_STRENGTH_PARAMS
    Returns (is_valid, errors) tuple
    """
    errors = []
    is_valid = True
    
    # Check minimum length
    if len(password) < settings.PASSWORD_STRENGTH_PARAMS.get('MIN_LENGTH', 8):
        errors.append(f"Password must be at least {settings.PASSWORD_STRENGTH_PARAMS.get('MIN_LENGTH', 8)} characters")
        is_valid = False
    
    # Check for uppercase letters
    if settings.PASSWORD_STRENGTH_PARAMS.get('REQUIRE_UPPERCASE', True) and not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
        is_valid = False
    
    # Check for lowercase letters
    if settings.PASSWORD_STRENGTH_PARAMS.get('REQUIRE_LOWERCASE', True) and not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
        is_valid = False
    
    # Check for numbers
    if settings.PASSWORD_STRENGTH_PARAMS.get('REQUIRE_NUMBERS', True) and not re.search(r'[0-9]', password):
        errors.append("Password must contain at least one number")
        is_valid = False
    
    # Check for special characters
    if settings.PASSWORD_STRENGTH_PARAMS.get('REQUIRE_SPECIAL_CHARS', True) and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character")
        is_valid = False
    
    return is_valid, errors

def get_password_strength_score(password):
    """
    Calculates a password strength score from 0-100
    Returns (score, feedback) tuple
    """
    score = 0
    feedback = []
    
    # Length score (up to 25 points)
    length = len(password)
    if length >= 12:
        score += 25
    elif length >= 10:
        score += 20
    elif length >= 8:
        score += 15
    elif length >= 6:
        score += 10
    else:
        feedback.append("Password is too short")
    
    # Character variety (up to 75 points)
    if re.search(r'[A-Z]', password):
        score += 15
    else:
        feedback.append("Add uppercase letters")
    
    if re.search(r'[a-z]', password):
        score += 15
    else:
        feedback.append("Add lowercase letters")
    
    if re.search(r'[0-9]', password):
        score += 15
    else:
        feedback.append("Add numbers")
    
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        score += 15
    else:
        feedback.append("Add special characters")
    
    # Extra points for variety (15 points)
    char_variety = len(set(password)) / len(password)
    score += int(15 * char_variety)
    
    # Provide appropriate feedback based on score
    if score < 40:
        strength = "Weak"
    elif score < 70:
        strength = "Medium"
    else:
        strength = "Strong"
    
    if not feedback:
        feedback = [f"Password strength: {strength}"]
    
    return score, feedback
