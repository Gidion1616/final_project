from rest_framework import serializers
from .models import JobApplication
from jobs.models import Job
from jobs.serializers import JobSerializer  # nested job info

class JobApplicationSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all())
    applied_at_formatted = serializers.DateTimeField(source='applied_at', format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = JobApplication
        fields = [
            'id', 'applicant_name', 'email', 'phone',
            'cv', 'certificates', 'photo', 'status',
            'job', 'applied_at_formatted'
        ]
        depth = 1
        