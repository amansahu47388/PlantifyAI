from django.urls import path
from .views import *
from Account import views
from .views import UserProfileView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('login/', views.LoginView.as_view(), name='auth_login'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    # path('test/', views.testEndPoint, name='test'),
    # path('', views.getRoutes),
]