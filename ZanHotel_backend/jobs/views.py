from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Job
from .serializers import JobSerializer



# -------------------------
# JOB DETAIL
# -------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def job_detail(request, pk):
    """Return single job details."""
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response(
            {'error': 'Job not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = JobSerializer(job)
    return Response(serializer.data)


# -------------------------
# JOB DELETE
# -------------------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job(request, pk):
    try:
        job = Job.objects.get(pk=pk, hotel=request.user)  # 🔒 ownership enforced
    except Job.DoesNotExist:
        return Response({"detail": "Job not found or not authorized"}, status=404)

    job.delete()
    return Response({"message": "Job deleted"}, status=204)

# -------------------------
# JOB LIST + CREATE
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def job_list(request):

    # GET ALL JOBS
    if request.method == 'GET':
        if hasattr(request.user, 'hotel_profile'):
            jobs = Job.objects.filter(hotel=request.user).order_by('-posted_at')

        # ✅ If user is JOBSEEKER → all jobs
        else:
            jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    # CREATE JOB
    elif request.method == 'POST':
        serializer = JobSerializer(
            data=request.data,
            context={"request": request}   
        )

        if serializer.is_valid():
            job = serializer.save()       # ❌ REMOVE hotel=request.user

            return Response(
                JobSerializer(job).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)