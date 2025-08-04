# jobs/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Job, JobApplication
from .serializers import JobSerializer, JobApplicationSerializer

@api_view(['GET'])
def job_list(request):
    jobs = Job.objects.all().order_by('-posted_at')
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def job_detail(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = JobSerializer(job)
    return Response(serializer.data)

@api_view(['POST'])
def job_apply(request):
    serializer = JobApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
