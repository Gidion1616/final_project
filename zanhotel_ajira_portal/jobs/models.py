from django.db import models
from django.conf import settings




class Job(models.Model):
    hotel = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Use this instead of User
        on_delete=models.CASCADE,
        related_name="jobs",
         null=True,  
        blank=True  
    )  # Link to hotel account
    hotel_name = models.CharField(max_length=100)  # Optional, for display
    title = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    description = models.TextField()
    experience = models.CharField(max_length=100)
    deadline = models.DateField()
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title







# class JobApplication(models.Model):
#     job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
#     jobseeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
#     applicant_name = models.CharField(max_length=100)
#     email = models.EmailField()
#     phone = models.CharField(max_length=20)
#     cv = models.FileField(upload_to='cvs/', null=True, blank=True)
#     certificate = models.FileField(upload_to='certificates/', null=True, blank=True)
#     photo = models.ImageField(upload_to='photos/', null=True, blank=True)
#     applied_at = models.DateTimeField(auto_now_add=True)
#     status = models.CharField(max_length=20)
#     STATUS_CHOICES = [
#         ('Pending', 'Pending'),
#         ('Accepted', 'Accepted'),
#         ('Rejected', 'Rejected'),
#     ]
    
#     status = models.CharField(
#         max_length=20,
#         choices=STATUS_CHOICES,
#         default='Pending'
#     )  # Add status for accept/reject

#     def __str__(self):
#         return f"{self.applicant_name} - {self.job.title}"


