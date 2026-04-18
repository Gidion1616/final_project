# urls.py
from django.urls import path
from .views import register_jobseeker, login_jobseeker, me, current_user

urlpatterns = [
    path('jobseeker/register/', register_jobseeker, name='jobseeker-register'),
    path('jobseeker/login/', login_jobseeker, name='jobseeker-login'),
    path("jobseeker/me/", me, name="jobseeker-me"),
    path("user/", current_user),
    # path('jobseeker/profile/', JobSeekerProfileView.as_view(), name='jobseeker-profile'),
    
]
