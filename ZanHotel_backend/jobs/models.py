from django.db import models
from django.conf import settings


class Job(models.Model):
    hotel = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    description = models.TextField()
    experience = models.CharField(max_length=100)
    deadline = models.DateField()
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title