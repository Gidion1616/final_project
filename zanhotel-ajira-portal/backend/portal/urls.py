from django.urls import path
from . import views
urlpatterns=[
 path('auth/register/jobseeker/',views.register_jobseeker),path('auth/register/hotel/',views.register_hotel),path('auth/login/',views.login_view),path('auth/me/',views.me),
 path('jobs/',views.jobs),path('jobs/<int:pk>/',views.job_detail),path('jobs/<int:pk>/apply/',views.apply_job),
 path('applications/',views.my_applications),path('hotel/overview/',views.hotel_overview),path('hotel/jobs/',views.hotel_jobs),path('hotel/jobs/<int:pk>/',views.hotel_job_detail),path('hotel/applications/<int:pk>/',views.update_application),
 path('admin/overview/',views.admin_overview),path('admin/hotels/<int:pk>/approve/',views.approve_hotel),path('admin/users/<int:pk>/toggle/',views.toggle_user),path('admin/jobs/<int:pk>/',views.admin_job),path('admin/settings/',views.settings_view)
]
