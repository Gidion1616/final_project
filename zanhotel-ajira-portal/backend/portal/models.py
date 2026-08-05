import secrets
from django.db import models
from django.contrib.auth.models import AbstractUser
class User(AbstractUser):
 ROLE_CHOICES=[('jobseeker','Job Seeker'),('hotel','Hotel'),('admin','Admin')]
 role=models.CharField(max_length=20,choices=ROLE_CHOICES,default='jobseeker');phone=models.CharField(max_length=30,blank=True);address=models.CharField(max_length=255,blank=True);date_of_birth=models.DateField(null=True,blank=True);gender=models.CharField(max_length=20,blank=True);photo=models.ImageField(upload_to='profiles/',blank=True);cv=models.FileField(upload_to='documents/',blank=True);recommendation_letter=models.FileField(upload_to='documents/',blank=True);academic_certificates=models.FileField(upload_to='documents/',blank=True);other_certificates=models.FileField(upload_to='documents/',blank=True)
class Hotel(models.Model):
 user=models.OneToOneField(User,on_delete=models.CASCADE,related_name='hotel');name=models.CharField(max_length=200);image=models.ImageField(upload_to='hotels/',blank=True);location=models.CharField(max_length=255);latitude=models.DecimalField(max_digits=9,decimal_places=6,null=True,blank=True);longitude=models.DecimalField(max_digits=9,decimal_places=6,null=True,blank=True);tin=models.CharField(max_length=80,unique=True);registration_number=models.CharField(max_length=80,unique=True);business_license=models.FileField(upload_to='licenses/',blank=True);approved=models.BooleanField(default=False);created_at=models.DateTimeField(auto_now_add=True)
class Job(models.Model):
 GENDERS=[('Any','Any'),('Male','Male'),('Female','Female')];hotel=models.ForeignKey(Hotel,on_delete=models.CASCADE,related_name='jobs');title=models.CharField(max_length=200);position=models.CharField(max_length=200);category=models.CharField(max_length=80);description=models.TextField();experience=models.CharField(max_length=100);gender=models.CharField(max_length=10,choices=GENDERS,default='Any');deadline=models.DateField();active=models.BooleanField(default=True);created_at=models.DateTimeField(auto_now_add=True)
 class Meta: ordering=['-created_at']
class Application(models.Model):
 STATUS=[('pending','Pending'),('accepted','Accepted'),('rejected','Rejected')];job=models.ForeignKey(Job,on_delete=models.CASCADE,related_name='applications');applicant=models.ForeignKey(User,on_delete=models.CASCADE,related_name='applications');status=models.CharField(max_length=20,choices=STATUS,default='pending');feedback=models.TextField(blank=True);created_at=models.DateTimeField(auto_now_add=True);updated_at=models.DateTimeField(auto_now=True)
 class Meta: constraints=[models.UniqueConstraint(fields=['job','applicant'],name='one_application_per_job')];ordering=['-created_at']
class ApiToken(models.Model):
 user=models.OneToOneField(User,on_delete=models.CASCADE,related_name='api_token');key=models.CharField(max_length=64,unique=True,default=secrets.token_hex);created_at=models.DateTimeField(auto_now_add=True)
class SiteSetting(models.Model):
 portal_name=models.CharField(max_length=120,default='ZanHotel Ajira Portal');support_email=models.EmailField(default='support@zanhotel.go.tz');maintenance_mode=models.BooleanField(default=False);recent_jobs_days=models.PositiveIntegerField(default=5)
