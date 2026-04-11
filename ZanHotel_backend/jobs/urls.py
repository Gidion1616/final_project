from django.urls import path
from . import views

urlpatterns = [
    path("jobs/", views.job_list, name="job-list"),
    path("jobs/<int:pk>/", views.job_detail, name="job-detail"),
    path('jobs/<int:pk>/delete/', views.delete_job),
]
