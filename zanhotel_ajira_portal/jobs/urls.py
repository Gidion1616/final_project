from django.urls import path
from .views import job_list_create, job_detail,apply_job
from . import views


urlpatterns = [
    path('jobs/', job_list_create, name='job-list-create'),
    path('jobs/<int:pk>/', job_detail, name='job-detail'),
    path('jobs/apply/', apply_job, name='apply_job'),
    path('api/jobs/hotel-applications/', views.hotel_applications, name='hotel-applications'),
    path('applications/', views.applications_by_hotel, name='applications_by_hotel'),

]
