from django.urls import path
from . import views

# Huunganisha ombi la frontend na view sahihi ya akaunti, ajira, hoteli au admin.
urlpatterns = [
    path("auth/register/jobseeker/", views.register_jobseeker),
    path("auth/register/hotel/", views.register_hotel),
    path("auth/login/", views.login_view),
    path("auth/password-reset/", views.password_reset_request),
    path("auth/password-reset/<str:uid>/<str:token>/", views.password_reset_confirm),
    path("auth/me/", views.me),
    path("site-content/", views.site_content),
    path("jobs/", views.jobs),
    path("jobs/<int:pk>/", views.job_detail),
    path("jobs/<int:pk>/apply/", views.apply_job),
    path("applications/", views.my_applications),
    path("applications/clear/", views.clear_my_applications),
    path("applications/<int:pk>/", views.manage_my_application),
    path("hotel/overview/", views.hotel_overview),
    path("hotel/report/", views.hotel_report),
    path("hotel/jobs/", views.hotel_jobs),
    path("hotel/jobs/<int:pk>/", views.hotel_job_detail),
    path("hotel/applications/<int:pk>/", views.update_application),
    path("admin/overview/", views.admin_overview),
    path("admin/report-data/", views.admin_report_data),
    path("admin/report/", views.admin_report),
    path("admin/hotels/<int:pk>/approve/", views.approve_hotel),
    path("admin/hotels/<int:pk>/detail/", views.admin_hotel_detail),
    path("admin/hotels/<int:pk>/classification/", views.classify_hotel),
    path("admin/users/<int:pk>/toggle/", views.toggle_user),
    path("admin/jobs/<int:pk>/", views.admin_job),
    path("admin/settings/", views.settings_view),
    path("admin/email/", views.admin_email_management),
]
