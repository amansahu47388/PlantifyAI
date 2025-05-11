from Account.models import CustomUser, EmailVerification
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import UserProfile, PasswordResetToken
from .utils import validate_password_strength


class CiustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # These are claims, you can add custom claims
        token['full_name'] = user.profile.full_name
        # token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        token['profile_image'] = str(user.profile.profile_image)
        token['verified'] = user.profile.verified
        token['address'] = user.profile.address
        token['dob'] = str(user.profile.dob)
        # ...
        return token


# Serializer for User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']


# Serializer for UserProfile
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['user', 'first_name', 'last_name', 'email', 'bio', 'profile_image', 'address', 'dob', 'phone', 'image_url']

    def get_image_url(self, obj):
        if obj.profile_image and hasattr(obj.profile_image, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return '/media/profile_pics/default.jpg'

    def validate_profile_image(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("Image size cannot exceed 5MB")
            if not value.content_type.startswith('image/'):
                raise serializers.ValidationError("Invalid image format")
        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        # Update user fields if present
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        
        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# Register serializer for user registration
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


# Email Verification OTP Serializer
class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(required=False, max_length=6, min_length=6)
    
    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist")
        return value
    
    def validate_otp(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("OTP must contain only digits")
        return value


# Resend OTP Serializer
class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist")
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        # Check if user with this email exists
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist.")
        return value

class PasswordResetVerifySerializer(serializers.Serializer):
    token = serializers.CharField()
    
    def validate_token(self, value):
        # Check if token exists and is valid
        try:
            token_obj = PasswordResetToken.objects.get(token=value, is_used=False)
            if not token_obj.is_valid():
                raise serializers.ValidationError("Token has expired.")
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid token.")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)
    password2 = serializers.CharField(min_length=8, write_only=True)
    
    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        
        # Check if token exists and is valid
        try:
            token_obj = PasswordResetToken.objects.get(token=data['token'], is_used=False)
            if not token_obj.is_valid():
                raise serializers.ValidationError("Token has expired.")
            self.token_obj = token_obj
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid token.")
        
        # Validate password strength
        is_valid, errors = validate_password_strength(data['password'])
        if not is_valid:
            raise serializers.ValidationError({"password": errors})
        
        return data
    
    def save(self):
        # Get user from token
        user = self.token_obj.user
        
        # Set new password
        user.set_password(self.validated_data['password'])
        user.save()
        
        # Mark token as used
        self.token_obj.is_used = True
        self.token_obj.save()
        
        return user