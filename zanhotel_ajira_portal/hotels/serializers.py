from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Hotel
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model


User = get_user_model()  # this will be JobSeeker

class HotelRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Hotel
        fields = ['id','hotel_name', 'email', 'password']

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        hotel_name = validated_data.get('hotel_name', '')

        # Create JobSeeker user first
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email already exists")

        user = User.objects.create(
            email=email,
            full_name=hotel_name,  # you can set hotel name as full_name
            is_active=True
        )
        user.set_password(password)
        user.save()

        # Create Hotel linked to the user
        hotel = Hotel.objects.create(user=user, **validated_data)
        return hotel


# class HotelRegisterSerializer(serializers.ModelSerializer):
#     email = serializers.EmailField(write_only=True)
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = Hotel
#         fields = ['hotel_name', 'email', 'password']

#     def create(self, validated_data):
#         email = validated_data.pop('email')
#         password = validated_data.pop('password')

#         # create User first
#         user, created = User.objects.get_or_create(username=email, defaults={'email': email})
#         if created:
#             user.set_password(password)
#             user.save()
#         else:
#             raise serializers.ValidationError("User with this email already exists")

#         hotel = Hotel.objects.create(user=user, **validated_data)
#         return hotel


class HotelLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)  # or use email if your backend supports it
            if user:
                data['user'] = user  # add user to validated_data
            else:
                raise serializers.ValidationError("Invalid email or password")
        else:
            raise serializers.ValidationError("Both email and password are required")
        return data