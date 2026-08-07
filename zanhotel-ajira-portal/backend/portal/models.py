import secrets
from django.db import models
from django.contrib.auth.models import AbstractUser


# Model hizi zinaeleza muundo wa kudumu wa taarifa ndani ya Django/SQLite.
class User(AbstractUser):
    """Akaunti ya kuingia pamoja na mawasiliano na nyaraka za Job Seeker."""

    ROLE_CHOICES = [("jobseeker", "Job Seeker"), ("hotel", "Hotel"), ("admin", "Admin")]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="jobseeker")
    phone = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=255, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to="profiles/", blank=True)
    cv = models.FileField(upload_to="documents/", blank=True)
    recommendation_letter = models.FileField(upload_to="documents/", blank=True)
    academic_certificates = models.FileField(upload_to="documents/", blank=True)
    other_certificates = models.FileField(upload_to="documents/", blank=True)


class Hotel(models.Model):
    """Wasifu wa biashara ya hoteli; approved huonyesha idhini ya Wizara."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="hotel")
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to="hotels/", blank=True)
    location = models.CharField(max_length=255)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    tin = models.CharField(max_length=80, unique=True)
    registration_number = models.CharField(max_length=80, unique=True)
    business_license = models.FileField(upload_to="licenses/", blank=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Job(models.Model):
    """Nafasi ya kazi inayomilikiwa na hoteli moja."""

    GENDERS = [("Any", "Any"), ("Male", "Male"), ("Female", "Female")]
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name="jobs")
    title = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    category = models.CharField(max_length=80)
    description = models.TextField()
    experience = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDERS, default="Any")
    deadline = models.DateField()
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class Application(models.Model):
    """Huunganisha mwombaji na ajira na kuhifadhi jibu la mwajiri."""

    STATUS = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    applicant = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="applications"
    )
    applicant_note = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="pending")
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job", "applicant"], name="one_application_per_job"
            )
        ]
        ordering = ["-created_at"]


class ApiToken(models.Model):
    """Token ya siri inayotumwa na React kuthibitisha maombi ya API."""

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="api_token"
    )
    key = models.CharField(max_length=64, unique=True, default=secrets.token_hex)
    created_at = models.DateTimeField(auto_now_add=True)


class SiteSetting(models.Model):
    """Mipangilio ya jina, maintenance na siku za ajira mpya inayodhibitiwa na Admin."""

    portal_name = models.CharField(max_length=120, default="ZanHotel Ajira Portal")
    support_email = models.EmailField(default="support@zanhotel.go.tz")
    maintenance_mode = models.BooleanField(default=False)
    hero_eyebrow = models.CharField(
        max_length=160, default="Zanzibar's hospitality careers platform"
    )
    hero_title = models.CharField(
        max_length=200, default="Your next opportunity starts here."
    )
    hero_subtitle = models.TextField(
        default="Discover verified hotel vacancies across Zanzibar. Build your profile once, apply with confidence."
    )
    hero_image = models.ImageField(upload_to="site/", blank=True)
    # EN: Number of days a newly posted job remains visible on the Home page.
    # SW: Idadi ya siku ambazo ajira mpya itaendelea kuonekana kwenye Home page.
    recent_jobs_days = models.PositiveIntegerField(default=3)
