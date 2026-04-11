

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Job
from .serializers import JobSerializer
from jobseeker.models import JobSeekerProfile


# -------------------------------
# Jobs endpoints
# -------------------------------

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def job_list(request):
#     """Return all jobs."""
#     jobs = Job.objects.all().order_by('-posted_at')
#     serializer = JobSerializer(jobs, many=True)
#     return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def job_detail(request, pk):
    """Return single job details."""
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = JobSerializer(job)
    return Response(serializer.data)


@api_view(['DELETE'])
def job_delete(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    
    job.delete()
    return Response({'message': 'Job deleted successfully'}, status=status.HTTP_204_NO_CONTENT)



# # --- Email and SMS imports ---
from django.core.mail import send_mail
from django.conf import settings
from jobseeker.models import JobSeekerProfile
from twilio.rest import Client


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def job_list(request):
    if request.method == 'GET':
        jobs = Job.objects.all().order_by('-posted_at')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            job = serializer.save(
    hotel=request.user,
    hotel_name=request.user.hotel_profile.hotel_name if hasattr(request.user, 'hotel_profile') else ""
)  # save first to get instance

            # --- Notify all registered jobseekers ---
            users = JobSeekerProfile.objects.all()
            for user in users:
                # --- Email Notification ---
                if user.user.email:
                    try:
                        send_mail(
                            subject=f"New Job Posted: {job.title}",
                            message=f"Hello {user.full_name},\n\nA new job '{job.title}' has been posted at '{job.hotel_name}'. Check the portal to apply!",
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[user.user.email],
                            fail_silently=True
                        )
                    except Exception as e:
                        print(f"Failed to send email to {user.user.email}: {e}")

                # --- SMS Notification ---
                if user.phone_number:
                    try:
                        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                        client.messages.create(
                            body=f"New Job Alert: '{job.title}' posted at '{job.hotel_name}'! Check portal for details.",
                            from_=settings.TWILIO_PHONE_NUMBER,
                            to=user.phone_number
                        )
                    except Exception as e:
                        print(f"Failed to send SMS to {user.phone_number}: {e}")

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# @api_view(['POST'])
# @parser_classes([MultiPartParser, FormParser])
# def apply_job(request):
#     serializer = JobApplicationSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# def hotel_applications(request):
#     hotel_name = request.GET.get('hotel_name')
#     if not hotel_name:
#         return Response({"error": "hotel_name is required"}, status=400)

#     jobs = Job.objects.filter(hotel_name=hotel_name)
#     job_ids = jobs.values_list('id', flat=True)
#     applications = JobApplication.objects.filter(job_id__in=job_ids)
#     serializer = JobApplicationSerializer(applications, many=True)
#     return Response(serializer.data)


# @api_view(['GET'])
# def applications_by_hotel(request):
#     hotel_name = request.query_params.get('hotel')
    
#     if not hotel_name:
#         return Response({'error': 'Hotel name is required as a query parameter.'}, status=400)

#     applications = JobApplication.objects.filter(job__hotel_name=hotel_name)
#     serializer = JobApplicationSerializer(applications, many=True)
#     return Response(serializer.data)





