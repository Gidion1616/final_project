from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


# class JobApplicationSerializer(serializers.ModelSerializer):
#     job_title = serializers.CharField(source='job.title', read_only=True)
#     hotel_name = serializers.CharField(source='job.hotel_name', read_only=True)
#     # applied_at = serializers.SerializerMethodField()
#     class Meta:
#         model = JobApplication
#         fields = [
#             'id', 'job', 'job_title', 'hotel_name',
#             'applicant_name', 'email', 'phone',
#             'cv', 'certificate', 'photo',  # ✅ make sure these are here
#             'applied_at'
#         ]
#     # def get_applied_at_formatted(self, obj):
#     #     return obj.applied_at.strftime("%Y-%m-%d %H:%M")