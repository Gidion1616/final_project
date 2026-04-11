from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Hotel

User = get_user_model()


# -------------------------
# HOTEL REGISTER SERIALIZER
# -------------------------
class HotelRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Hotel
        fields = ['id', 'hotel_name', 'email', 'password']

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        hotel_name = validated_data.get('hotel_name')

        # check duplicate user
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email already exists")

        # create user properly (IMPORTANT FIX)
        user = User.objects.create_user(
            email=email,
            password=password,
            full_name=hotel_name,
            is_active=True
        )

        # create hotel profile
        hotel = Hotel.objects.create(
            user=user,
            hotel_name=hotel_name
        )

        return hotel


# -------------------------
# HOTEL LOGIN SERIALIZER
# -------------------------
class HotelLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required")

        # SAFE authentication for custom user model
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password")

        data['user'] = user
        return data