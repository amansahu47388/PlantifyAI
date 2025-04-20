from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth import get_user_model, authenticate, login
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.authtoken.models import Token
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.decorators import login_required
from .models import UserProfile


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
                last_name=data['last_name']
            )
            
            # Generate auth token
            token, _ = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': 'User registered successfully',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'token': token.key
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )



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
            
            # Generate token
            token, _ = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': 'Login successful',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'token': token.key
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

@login_required
class ProfileView(APIView):
    def get(self, request):
        try:
            user = request.user
            return Response({
                'success': 'User profile fetched successfully',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'image': user.profile.image.url if user.profile.image else None,
                    'bio': user.profile.bio,
                    'location': user.profile.location,
                    'birth_date': user.profile.birth_date,
                    'phone': user.profile.phone,

                }
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )