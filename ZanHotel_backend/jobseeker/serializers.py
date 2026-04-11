# serializers.py
from rest_framework import serializers
from .models import JobSeeker







# jobSeeker

class JobSeekerSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = JobSeeker
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True},  # don’t expose password in response
        }

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": ["Passwords do not match"]})
        return data

    def create(self, validated_data):
        # Remove confirm_password from validated_data
        validated_data.pop("confirm_password", None)

        # Remove password to hash it
        password = validated_data.pop("password")

        # Pop M2M fields to prevent errors
        groups = validated_data.pop("groups", None)
        user_permissions = validated_data.pop("user_permissions", None)

        # Create JobSeeker instance
        user = JobSeeker(**validated_data)
        user.set_password(password)  # hash password
        user.save()

        # Assign M2M fields after saving
        if groups:
            user.groups.set(groups)
        if user_permissions:
            user.user_permissions.set(user_permissions)

       
        return user



# JobSeeker Login
class JobSeekerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)




