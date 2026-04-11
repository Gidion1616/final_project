from django.db import models
from django.conf import settings

class Hotel(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='hotel_profile'
    )
    hotel_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.hotel_name