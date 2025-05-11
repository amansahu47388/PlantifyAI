from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth import get_user_model, authenticate, login
from rest_framework import status
from .serializers import RegisterSerializer, EmailVerificationSerializer, ResendOTPSerializer, PasswordResetRequestSerializer, PasswordResetVerifySerializer, PasswordResetConfirmSerializer
from rest_framework.authtoken.models import Token
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.decorators import login_required
from .models import UserProfile, EmailVerification, PasswordResetToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User  # Import the built-in User model
from .serializers import ProfileSerializer
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings 
from .utils import send_otp_email, validate_password_strength, get_password_strength_score, send_email_with_fallback

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MyTokenRefreshView(TokenRefreshView):
    pass

class RegisterView(APIView):
    def post(self, request):
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['email', 'password', 'password2', 'first_name', 'last_name']
            for field in required_fields:
                if not data.get(field):
                    return Response(
                        {'error': f'{field} is required'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Validate email format
            try:
                validate_email(data['email'])
            except ValidationError:
                return Response(
                    {'error': 'Invalid email format'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if email exists
            if User.objects.filter(email=data['email']).exists():
                return Response(
                    {'error': 'Email already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate password match
            if data['password'] != data['password2']:
                return Response(
                    {'error': 'Passwords do not match'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate password strength
            is_valid, errors = validate_password_strength(data['password'])
            if not is_valid:
                return Response(
                    {'error': 'Password is not strong enough', 'details': errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create user
            user = User.objects.create_user(
                email=data['email'],
                username=data['email'],  # Set username same as email
                password=data['password'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                is_active=True,  # Set to False if you want to prevent login until email is verified
            )
            
            # Create user profile
            UserProfile.objects.create(
                user=user,
                bio='',
                address='',
                phone=''
            )
            
            # Generate OTP and create verification record
            otp = EmailVerification.generate_otp()
            verification = EmailVerification.objects.create(
                user=user,
                otp=otp,
                expires_at=timezone.now() + timezone.timedelta(minutes=10)
            )
            
            # Send OTP to user's email
            email_sent = send_otp_email(user.email, otp)
            
            # Generate JWT tokens
            refresh = MyTokenObtainPairSerializer.get_token(user)
            
            response_data = {
                'success': 'User registered successfully',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'requires_verification': True,
                    'email_sent': email_sent
                }
            }
            
            # Include OTP in response during development
            if settings.DEBUG:
                response_data['data']['development_otp'] = otp
                response_data['data']['note'] = 'This OTP is only included in DEBUG mode'
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def send_verification_email(self, email, otp):
        subject = 'Verify your PlantifyAI account'
        message = f'Your verification code is: {otp}\n\nThis code is valid for 10 minutes.'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]
        
        # Print OTP clearly in console for development
        print("\n" + "="*50)
        print(f"📧 VERIFICATION EMAIL FOR: {email}")
        print(f"📟 OTP CODE: {otp}")
        print("="*50 + "\n")
        
        try:
            send_mail(subject, message, from_email, recipient_list)
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False


class LoginView(APIView):
    def post(self, request):
        try:
            data = request.data
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return Response(
                    {'error': 'Please provide both email and password'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get user by email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check password
            if not user.check_password(password):
                return Response(
                    {'error': 'Invalid password'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if user's email is verified
            profile, created = UserProfile.objects.get_or_create(user=user)
            if not profile.is_email_verified:
                return Response(
                    {'error': 'Email not verified', 'requires_verification': True, 'email': user.email},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Generate JWT tokens
            refresh = MyTokenObtainPairSerializer.get_token(user)
            
            return Response({
                'success': 'Login successful',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class VerifyOTPView(APIView):
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        otp = serializer.validated_data.get('otp')
        
        try:
            user = User.objects.get(email=email)
            profile, created = UserProfile.objects.get_or_create(user=user)
            
            # Get the latest non-verified OTP for this user
            verification = EmailVerification.objects.filter(
                user=user,
                is_verified=False
            ).order_by('-created_at').first()
            
            if not verification:
                return Response({
                    'error': 'No verification request found',
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # If just checking if verification is needed
            if not otp:
                return Response({
                    'requires_verification': not profile.is_email_verified,
                }, status=status.HTTP_200_OK)
            
            # Verify OTP
            if verification.otp != otp:
                return Response({
                    'error': 'Invalid OTP',
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if OTP is expired
            if not verification.is_valid():
                return Response({
                    'error': 'OTP expired',
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Mark as verified
            verification.is_verified = True
            verification.save()
            
            # Update user verification status
            profile.is_email_verified = True
            profile.save()
            
            # Generate tokens for automatic login
            refresh = MyTokenObtainPairSerializer.get_token(user)
            
            return Response({
                'success': 'Email verified successfully',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found',
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e),
            }, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            profile, created = UserProfile.objects.get_or_create(user=user)
            
            # Check if user is already verified
            if profile.is_email_verified:
                return Response({
                    'message': 'Email already verified',
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Invalidate all previous OTPs
            EmailVerification.objects.filter(user=user, is_verified=False).update(
                expires_at=timezone.now()
            )
            
            # Generate new OTP
            otp = EmailVerification.generate_otp()
            verification = EmailVerification.objects.create(
                user=user,
                otp=otp,
                expires_at=timezone.now() + timezone.timedelta(minutes=10)
            )
            
            # Print OTP clearly in console for development
            print("\n" + "="*50)
            print(f"📧 RESEND VERIFICATION EMAIL FOR: {email}")
            print(f"📟 NEW OTP CODE: {otp}")
            print("="*50 + "\n")
            
            # Send email using our new utility
            email_sent = send_otp_email(email, otp)
            
            response_data = {
                'success': 'Verification code sent successfully',
                'email_sent': email_sent
            }
            
            # Include OTP in response during development
            if settings.DEBUG:
                response_data['development_otp'] = otp
                response_data['note'] = 'This OTP is only included in DEBUG mode'
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found',
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e),
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile, created = UserProfile.objects.get_or_create(
                user=request.user,
                defaults={
                    'bio': '',
                    'address': '',
                    'dob': None,
                    'phone': '',
                    'profile_image': None
                }
            )
            serializer = ProfileSerializer(profile, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            data = request.data.copy()

            if 'profile_image' in request.FILES:
                # Delete old image if it exists and is not the default
                if profile.profile_image and profile.profile_image.name != 'default.jpg':
                    try:
                        profile.profile_image.delete(save=False)
                    except:
                        pass  # Ignore if file doesn't exist
                data['profile_image'] = request.FILES['profile_image']

            serializer = ProfileSerializer(profile, data=data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class CheckPasswordStrengthView(APIView):
    """
    API endpoint to check password strength without creating a user.
    This allows frontend to provide real-time feedback as users type their password.
    """
    def post(self, request):
        password = request.data.get('password', '')
        
        if not password:
            return Response({
                'score': 0,
                'strength': 'Weak',
                'feedback': ['Password is required']
            })
        
        # Check if password meets minimum requirements
        is_valid, errors = validate_password_strength(password)
        
        # Get detailed strength score and feedback
        score, feedback = get_password_strength_score(password)
        
        # Determine strength category
        if score < 40:
            strength = 'Weak'
        elif score < 70:
            strength = 'Medium'
        else:
            strength = 'Strong'
        
        return Response({
            'score': score,
            'is_valid': is_valid,
            'strength': strength,
            'feedback': errors if errors else feedback
        })

class PasswordResetRequestView(APIView):
    """
    Request a password reset link
    """
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            
            # Generate a password reset token
            reset_token = PasswordResetToken.generate_token(user)
            
            # Create the reset link pointing to the frontend application
            protocol = 'https' if request.is_secure() else 'http'
            domain = request.get_host()
            
            # Frontend is likely running on a different port/domain than the backend in development
            # For local development (adjust these URLs for your environment)
            if domain == 'localhost:8000' or domain == '127.0.0.1:8000':
                frontend_base_url = 'http://localhost:5173'  # Typical Vite/React development server
            else:
                # In production, frontend and backend might be on the same domain
                frontend_base_url = f"{protocol}://{domain}"
                
            reset_link = f"{frontend_base_url}/reset-password?token={reset_token.token}"
            
            # Send the reset link in an email
            subject = "Reset your PlantifyAI password"
            plain_message = f"""
Hello,

You've requested a password reset for your PlantifyAI account.

Please use the following link to reset your password:
{reset_link}

This link is valid for 24 hours.

If you didn't request this reset, you can safely ignore this email.

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
        <p>You've requested a password reset for your PlantifyAI account.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 25px 0;">
            <a href="{reset_link}" style="background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="background-color: #f9f9f9; padding: 10px; word-break: break-all;">{reset_link}</p>
        <p>This link is valid for <strong>24 hours</strong>.</p>
        <p>If you didn't request this reset, you can safely ignore this email.</p>
        <p>Thank you,<br>PlantifyAI Team</p>
    </div>
</body>
</html>
"""
            
            email_sent = send_email_with_fallback(
                subject=subject,
                message=plain_message,
                recipient_email=email,
                html_message=html_message
            )
            
            return Response({
                'success': 'Password reset link has been sent to your email.',
                'email_sent': email_sent
            })
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found',
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e),
            }, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetVerifyView(APIView):
    """
    Verify if a password reset token is valid
    """
    def post(self, request):
        serializer = PasswordResetVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        token = serializer.validated_data['token']
        # Token validation is done in the serializer
        
        return Response({
            'success': 'Token is valid.',
            'token': token
        })


class PasswordResetConfirmView(APIView):
    """
    Reset password using a valid token
    """
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Reset password and mark token as used
        user = serializer.save()
        
        return Response({
            'success': 'Password has been reset successfully.',
            'email': user.email
        })
