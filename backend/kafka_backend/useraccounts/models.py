import uuid
from django.contrib.auth.models import UserManager, AbstractBaseUser, PermissionsMixin
from django.db import models
from django.conf import settings
# Create your models here.


class CustomUserManager(UserManager):
    def _create_user(self,name, email, password, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set.")
        email = self.normalize_email(email)
         # Set default name if not provided (extract from email)
        if not name:
            name = email.split('@')[0]
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)  # Set the password properly
        user.save(using=self._db)
        return user

    def create_user(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(name, email, password, **extra_fields)

    def create_superuser(self, name=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self._create_user(name, email, password, **extra_fields)  # Pass the password here


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    profile_image = models.ImageField(
        upload_to="uploads/profile_images", blank=True, null=True
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)
    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    def profile_image_url(self):
        if self.profile_image:
            return f"{settings.WEBSITE_URL}{self.profile_image.url}"
        else:
            return ''
        
    def save(self, *args, **kwargs):
        # Ensure users always have a name
        if not self.name and self.email:
            self.name = self.email.split('@')[0]
        super().save(*args, **kwargs)
