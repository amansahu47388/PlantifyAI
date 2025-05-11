from django.urls import path
from .views import *
from Account import views
from .views import UserProfileView, VerifyOTPView, ResendOTPView, CheckPasswordStrengthView, PasswordResetRequestView, PasswordResetVerifyView, PasswordResetConfirmView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('login/', views.LoginView.as_view(), name='auth_login'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend_otp'),
    path('check-password-strength/', CheckPasswordStrengthView.as_view(), name='check_password_strength'),
    
    # Password reset URLs
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/verify/', PasswordResetVerifyView.as_view(), name='password_reset_verify'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]