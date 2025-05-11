from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import os
from django.utils import timezone
import random
import string

class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('username', email)  # Set username to email
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)

    # Add related_name arguments to resolve the clash
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_set',
        related_query_name='custom_user'
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'



class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    address = models.CharField(max_length=100, blank=True)
    dob = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=10, blank=True)
    profile_image = models.ImageField(upload_to='profile_pics/', default='default.jpg')
    is_email_verified = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.email} Profile'

    def save(self, *args, **kwargs):
        # Create directory if it doesn't exist
        if self.profile_image:
            img_path = os.path.join(settings.MEDIA_ROOT, 'profile_pics')
            os.makedirs(img_path, exist_ok=True)
        super().save(*args, **kwargs)


class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} - {self.otp}"
    
    def save(self, *args, **kwargs):
        # Set expiration time to 10 minutes from creation if not set
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_otp():
        # Generate a 6-digit OTP
        return ''.join(random.choices(string.digits, k=6))
    
    def is_valid(self):
        # Check if OTP is expired
        return timezone.now() <= self.expires_at and not self.is_verified


