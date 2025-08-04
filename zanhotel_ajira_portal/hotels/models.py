from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class Hotel(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Consider hashing in production

    def __str__(self):
        return self.name
