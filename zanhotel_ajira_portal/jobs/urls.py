from django.urls import path
from . import views

urlpatterns = [
    path("jobs/", views.job_list, name="job-list"),
    path("jobs/<int:pk>/", views.job_detail, name="job-detail"),
    path('jobs/<int:pk>/delete/', views.job_delete),
]




# from django.urls import path
# from .views import job_list_create, job_detail,apply_job
# from . import views


# urlpatterns = [
#     path('jobs/', job_list_create, name='job-list-create'),
#     path('jobs/<int:pk>/', job_detail, name='job-detail'),
#     path('jobs/apply/', apply_job, name='apply_job'),    

# ]
