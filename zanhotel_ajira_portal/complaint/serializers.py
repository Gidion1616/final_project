from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ["id", "full_name", "email", "subject", "message", "file", "created_at"]
        read_only_fields = ["id", "created_at"]