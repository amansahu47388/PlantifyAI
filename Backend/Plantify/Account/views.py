from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth import get_user_model, authenticate, login
from rest_framework import status
from .serializers import RegisterSerializer, EmailVerificationSerializer, ResendOTPSerializer
from rest_framework.authtoken.models import Token
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.decorators import login_required
from .models import UserProfile, EmailVerification
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User  # Import the built-in User model
from .serializers import ProfileSerializer
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings 
from .utils import send_otp_email

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
