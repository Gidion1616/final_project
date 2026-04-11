from django.db import models
from django.conf import settings
# from django.contrib.auth import get_user_model
from jobs.models import Job

User = settings.AUTH_USER_MODEL

class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    jobseeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="applications")
    applicant_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        blank=True,
        null=True,
    )
    address = models.CharField(max_length=255, null=True, blank=True)
    cv = models.FileField(upload_to="cvs/", null=True, blank=True)
    certificates = models.FileField(upload_to="certificates/", null=True, blank=True)
    photo = models.ImageField(upload_to="photos/", null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[("Pending", "Pending"), ("Accepted", "Accepted"), ("Rejected", "Rejected")],
        default="Pending"
    )
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant_name} applied for {self.job.title} ({self.status})"









# class JobApplication(models.Model):
#     job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
#     jobseeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="applications")
#     # ✅ Automatically pulled from JobSeekerProfile
#     applicant_name = models.CharField(max_length=255, blank=True)
#     email = models.EmailField(blank=True)
#     phone = models.CharField(max_length=50, blank=True)
#     date_of_birth = models.DateField(null=True, blank=True)
#     gender = models.CharField(
#         max_length=10,
#         choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
#         blank=True,
#         null=True,
#     )
#     address = models.CharField(max_length=255, null=True, blank=True)
#     cv = models.FileField(upload_to="cvs/", null=True, blank=True)
#     certificates = models.FileField(upload_to="certificates/", null=True, blank=True)
#     photo = models.ImageField(upload_to="photos/", null=True, blank=True)

#     # ✅ Add status field
#     status = models.CharField(
#         max_length=20,
#         choices=[("Pending", "Pending"), ("Accepted", "Accepted"), ("Rejected", "Rejected")],
#         default="Pending"
#     )

#     applied_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.applicant_name} applied for {self.job.title} ({self.status})"



