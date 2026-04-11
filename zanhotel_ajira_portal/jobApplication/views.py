from rest_framework.decorators import api_view, permission_classes, authentication_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import JobApplication
from .serializers import JobApplicationSerializer
from jobseeker.models import JobSeekerProfile
from jobseeker.models import HotelUser 
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from jobs.models import Job  # ensure this import exists



# -------------------------------
# Jobseeker endpoints
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):
    """Return applications submitted by the logged-in user."""
    applications = JobApplication.objects.filter(jobseeker=request.user).order_by('-applied_at')
    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data)
@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def apply_job(request):
    """
    Apply to a job.
    """
    user = request.user

    # ✅ STEP 1: Get job_id
    job_id = request.data.get('job')

    if not job_id:
        return Response({"error": "Job ID is required"}, status=400)

    # ✅ STEP 2: Fetch job
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    # ✅ STEP 3: Get profile
    try:
        profile = JobSeekerProfile.objects.get(user=user)
    except JobSeekerProfile.DoesNotExist:
        return Response({"detail": "JobSeeker profile not found."}, status=400)

    # ✅ STEP 4: Prepare data
    data = request.data.copy()
    data.update({
        'applicant_name': profile.full_name,
        'email': profile.user.email,
        'phone': profile.phone_number,
        'date_of_birth': profile.date_of_birth,
        'gender': profile.gender,
        'address': profile.address,
        'cv': profile.cv if profile.cv else None,
        'certificates': profile.certificate if profile.certificate else None,
        'photo': profile.photo if profile.photo else None,
        'job': job.id
    })

    # ✅ STEP 5: Save
    serializer = JobApplicationSerializer(data=data)

    if serializer.is_valid():
        serializer.save(jobseeker=user, job=job)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)
# -------------------------------
# Hotel dashboard: applications
# -------------------------------
@api_view(['GET', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_view(request):
    return Response({"user": request.user.email})
def applications_for_hotel(request):
    """
    GET: List applications for the logged-in hotel's jobs.
    PATCH: Update status of a specific application.
    """
    # Fetch hotel info from HotelUser model
    try:
        hotel_user = HotelUser.objects.get(user=request.user)
        hotel_name = hotel_user.hotel_name
    except HotelUser.DoesNotExist:
        return Response([], status=status.HTTP_200_OK)

    # -------------------------------
    # GET: list applications
    # -------------------------------
    if request.method == 'GET':
        applications = JobApplication.objects.filter(job__hotel_name=hotel_name).order_by('-applied_at')
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    # -------------------------------
    # PATCH: update application status
    # -------------------------------
    elif request.method == 'PATCH':
        app_id = request.data.get('id')
        new_status = request.data.get('status')

        if not app_id or not new_status:
            return Response({"error": "Provide application ID and new status"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            application = JobApplication.objects.get(id=app_id, job__hotel_name=hotel_name)
        except JobApplication.DoesNotExist:
            return Response({"error": "Application not found"}, status=status.HTTP_404_NOT_FOUND)

        application.status = new_status
        application.save()
        serializer = JobApplicationSerializer(application)
        return Response(serializer.data)





# from rest_framework.decorators import api_view, permission_classes, authentication_classes
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth import get_user_model
# from .models import Job, JobApplication
# from .serializers import JobSerializer, JobApplicationSerializer
# from jobseeker.models import JobSeekerProfile, HotelUser, JobSeeker
# from rest_framework.authentication import TokenAuthentication

# User = get_user_model()


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def job_apply(request):
#     """
#     Apply to a job.
#     Only 'job' field is required in request.data.
#     Applicant info is pulled automatically from JobSeekerProfile.
#     """
#     user = request.user

#     # Get jobseeker profile
#     try:
#         profile = JobSeekerProfile.objects.get(user=user)
#     except JobSeekerProfile.DoesNotExist:
#         return Response({"detail": "JobSeeker profile not found."}, status=status.HTTP_400_BAD_REQUEST)

#     # Merge profile info into request.data
#     data = request.data.copy()
#     data.update({
#         'applicant_name': profile.full_name,
#         'email': profile.user.email,
#         'phone': profile.phone_number,
#         'date_of_birth': profile.date_of_birth,
#         'gender': profile.gender,
#         'address': profile.address,
#         'cv': profile.cv.url if profile.cv else None,
#         'certificates': profile.certificates.url if profile.certificates else None,
#         'photo': profile.photo.url if profile.photo else None,
#     })

#     serializer = JobApplicationSerializer(data=data, context={'request': request})
#     if serializer.is_valid():
#         serializer.save(jobseeker=user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def my_applications(request):
#     """
#     Return only the applications submitted by the logged-in user,
#     including nested job info.
#     """
#     try:
#         user_id = request.user.id
#         applications = JobApplication.objects.filter(email=request.user.email).order_by("-applied_at")
#         serializer = JobApplicationSerializer(applications, many=True)
#         return Response(serializer.data)
#     except Exception as e:
#         print("ERROR in my_applications view:", e)
#         return Response({"error": str(e)}, status=500)
    



