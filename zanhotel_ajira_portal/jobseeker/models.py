from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone
from django.conf import settings





class JobSeekerManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)



class JobSeeker(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)

    # ✅ New fields
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        null=True,
        blank=True,
    )
    address = models.CharField(max_length=255, blank=True, null=True)

    # Existing file uploads
    cv = models.FileField(upload_to='cvs/', blank=True, null=True)
    certificate = models.FileField(upload_to='certificates/', blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    # Auth fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = JobSeekerManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone_number']

    def __str__(self):
        return self.email


class HotelUser(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hotel_name = models.CharField(max_length=255)

    def __str__(self):
        return self.hotel_name


# Job Seeker Profile
class JobSeekerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(max_length=254, unique=True)
    date_of_birth = models.DateField(null=True, blank=True)   # ✅ new
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        null=True,
        blank=True,
    )  # ✅ new
    address = models.CharField(max_length=255, null=True, blank=True)  # ✅ new

    cv = models.FileField(upload_to="cvs/", blank=True, null=True)
    certificate = models.FileField(upload_to="certificates/", blank=True, null=True)
    photo = models.ImageField(upload_to="photos/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.user.email}"


