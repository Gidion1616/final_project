from django.db import models

class Job(models.Model):
    hotel_name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    experience = models.CharField(max_length=255)
    deadline = models.DateField()
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.hotel_name}"

class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    applicant_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.TextField(blank=True)  # used 'message' field from form
    cv = models.FileField(upload_to='cvs/')
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application from {self.applicant_name} for {self.job.title}"
