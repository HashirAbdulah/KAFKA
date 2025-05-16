import uuid
from django.contrib.auth.models import UserManager, AbstractBaseUser, PermissionsMixin
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
# Create your models here.


class CustomUserManager(UserManager):
    def _create_user(self, name, email, password, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set.")
        if not name:
            raise ValueError("The Name field must be set.")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, name, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(name, email, password, **extra_fields)

    def create_superuser(self, name, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self._create_user(name, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=False, null=False)
    profile_image = models.ImageField(
        upload_to="uploads/profile_images", blank=True, null=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)

    # New Profile Fields
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True, choices=[
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('P', 'Prefer not to say')
    ])
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    interests = models.TextField(blank=True, null=True)
    occupation = models.CharField(max_length=255, blank=True, null=True)
    education = models.TextField(blank=True, null=True)

    # Verification Fields
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    is_identity_verified = models.BooleanField(default=False)

    # Privacy Settings
    show_email_publicly = models.BooleanField(default=False)
    show_phone_publicly = models.BooleanField(default=False)

    # Session Management
    active_sessions = models.JSONField(default=dict, blank=True)

    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def profile_image_url(self):
        if self.profile_image:
            return f"{settings.WEBSITE_URL}{self.profile_image.url}"
        else:
            return ""

    def clean(self):
        super().clean()
        if not self.name:
            raise ValidationError({"name": "Name is required."})

    def save(self, *args, **kwargs):
        # Ensure users always have a name
        if not self.name and self.email:
            self.name = self.email.split("@")[0]
        super().save(*args, **kwargs)

    def update_last_login(self):
        self.last_login = timezone.now()
        self.save(update_fields=['last_login'])

    def add_active_session(self, session_id, device_info):
        if not self.active_sessions:
            self.active_sessions = {}
        self.active_sessions[session_id] = {
            'device_info': device_info,
            'last_activity': timezone.now().isoformat()
        }
        self.save(update_fields=['active_sessions'])

    def remove_active_session(self, session_id):
        if self.active_sessions and session_id in self.active_sessions:
            del self.active_sessions[session_id]
            self.save(update_fields=['active_sessions'])
