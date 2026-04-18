from rest_framework import serializers
from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source="jobseeker.full_name", read_only=True)
    hotel_name = serializers.CharField(source="job.hotel.hotel_profile.hotel_name", read_only=True)
    position = serializers.CharField(source="job.title", read_only=True)
    location = serializers.CharField(source="job.location", read_only=True)
    # Applicant info (JobSeeker)
    email = serializers.CharField(source="jobseeker.email", read_only=True)
    phone = serializers.CharField(source="jobseeker.phone_number", read_only=True)
    address = serializers.CharField(source="jobseeker.address", read_only=True)
    photo = serializers.ImageField(source="jobseeker.photo", read_only=True)
    cv = serializers.FileField(source="jobseeker.cv", read_only=True)
    certificate = serializers.FileField(source="jobseeker.certificate", read_only=True)




    class Meta:
        model = JobApplication
        fields = [
            "id",
            "job",
            "applicant_name",
            "hotel_name",
            "position",
            "location",
            "status",
            "applied_at",
            "email",
            "phone",
            "address",
            "photo",
            "cv",
            "certificate",
            
        ]
        read_only_fields = ["jobseeker", "status", "applied_at"]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["jobseeker"] = request.user
        return super().create(validated_data)
    def validate(self, data):
        request = self.context.get("request")
        job = data.get("job")

        if request and job:
            exists = JobApplication.objects.filter(
                job=job,
                jobseeker=request.user
            ).exists()

            if exists:
                raise serializers.ValidationError(
                    {"detail": "You have already applied for this job."}
                )

        return data



        
    