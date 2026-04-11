from django.urls import path
from . import views

urlpatterns = [
    path("apply/", views.apply_job, name="job-apply"),
    path("my-applications/", views.my_applications, name="my-applications"),
    # path("hotel-applications/", views.applications_for_hotel, name="hotel-applications"),
]


# from django.urls import path
# from . import views


# urlpatterns = [
#     path("", views.job_list, name="job-list"),
#     path("<int:pk>/", views.job_detail, name="job-detail"),
#     path("apply/", views.job_apply, name="job-apply"),
#     path("my-applications/", views.my_applications, name="my-applications"),
    
# ]