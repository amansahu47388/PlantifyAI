from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('crop-disease/', include('CropDisease.urls')),
    path('account/', include('Account.urls')),
]
