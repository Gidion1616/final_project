from django.urls import path
from .views import register_hotel
from .views import CustomAuthToken

urlpatterns = [
    path('register/', register_hotel, name='register_hotel'),
    path('api/hotel-login/', CustomAuthToken.as_view(), name='hotel_login'),
]
