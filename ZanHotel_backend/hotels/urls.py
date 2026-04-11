from django.urls import path
from .views import HotelRegisterView, HotelLoginView
# from .views import HotelDashboardView


urlpatterns = [
    path('register/', HotelRegisterView.as_view(), name='hotel-register'),
    path('login/', HotelLoginView.as_view(), name='hotel-login'),
    # path('dashboard/', HotelDashboardView.as_view(), name='hotel-dashboard'),
]


