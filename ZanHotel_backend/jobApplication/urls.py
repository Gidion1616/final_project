from django.urls import path
from . import views


urlpatterns = [
    path("apply/", views.apply_job, name="job-apply"),
    path("my-applications/", views.my_applications, name="my-applications"),
    path("hotel-applications/", views.applications_for_hotel, name="hotel-applications"),
    path("applications/<int:pk>/delete/", views.delete_application),
]