from django.urls import path
from . import views

urlpatterns = [
    path("complaints/", views.complaint_create_list, name="complaint-create-list"),
]