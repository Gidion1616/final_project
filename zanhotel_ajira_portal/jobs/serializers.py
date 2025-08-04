from rest_framework import serializers
from .models import Job, JobApplication


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'


class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    hotel_name = serializers.CharField(source='job.hotel_name', read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'job_title', 'hotel_name',
            'applicant_name', 'email', 'phone',
            'cv', 'certificate', 'photo',  # ✅ make sure these are here
            'applied_at'
        ]