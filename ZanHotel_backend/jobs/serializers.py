from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    hotel_name = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id',
            'hotel',
            'hotel_name',
            'title',
            'location',
            'description',
            'experience',
            'deadline',
            'posted_at'
        ]
        read_only_fields = ['hotel']

    # ✅ MUST BE OUTSIDE Meta
    def get_hotel_name(self, obj):
        try:
            return obj.hotel.hotel_profile.hotel_name
        except:
            return ""

    # ✅ MUST BE OUTSIDE Meta
    def create(self, validated_data):
        request = self.context["request"]

        hotel = request.user  # adjust if needed

        validated_data["hotel"] = hotel
        return super().create(validated_data)