# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.contrib.auth import get_user_model
# from jobseeker.models import JobSeekerProfile

# User = get_user_model()

# @receiver(post_save, sender=User)
# def create_or_update_jobseeker_profile(sender, instance, created, **kwargs):
#     """
#     Creates or updates JobSeekerProfile on user creation/update.
#     """
#     if created:
#         # Check if profile already exists to avoid duplicate creation
#         if not hasattr(instance, 'jobseeker_profile'):
#             JobSeekerProfile.objects.create(
#                 user=instance,
#                 full_name=getattr(instance, "full_name", instance.email),
#                 email=instance.email,
#                 phone_number=getattr(instance, "phone_number", ""),
#                 date_of_birth=getattr(instance, "date_of_birth", None),
#                 gender=getattr(instance, "gender", ""),
#                 address=getattr(instance, "address", ""),
#                 cv=getattr(instance, "cv", None),
#                 certificate=getattr(instance, "certificate", None),
#                 photo=getattr(instance, "photo", None),
#             )
#     else:
#         # Update existing profile if it exists
#         if hasattr(instance, 'jobseeker_profile'):
#             instance.jobseeker_profile.save()





from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from jobseeker.models import JobSeekerProfile

User = get_user_model()

@receiver(post_save, sender=User)
def create_or_update_jobseeker_profile(sender, instance, created, **kwargs):
    """
    Creates a JobSeekerProfile on user creation.
    Updates the profile on user save.
    """
    if created:
        # 🚨 ADD THIS CHECK to avoid duplicates
        if not hasattr(instance, 'jobseeker_profile'):
            JobSeekerProfile.objects.create(
                user=instance,
                full_name=getattr(instance, "full_name", ""),
                email=instance.email,
                phone_number=getattr(instance, "phone_number", ""),
                date_of_birth=getattr(instance, "date_of_birth", None),
                gender=getattr(instance, "gender", ""),
                address=getattr(instance, "address", ""),
                cv=getattr(instance, "cv", None),
                certificate=getattr(instance, "certificate", None),
                photo=getattr(instance, "photo", None),
            )
    else:
        if hasattr(instance, "jobseeker_profile"):
            instance.jobseeker_profile.save()