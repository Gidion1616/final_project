from rest_framework import status
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .models import JobApplication, Job
from .serializers import JobApplicationSerializer





@api_view(['GET', 'POST'])
def job_list_create(request):
    if request.method == 'GET':
        jobs = Job.objects.all().order_by('-posted_at')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def job_detail(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobSerializer(job)
    return Response(serializer.data)




@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def apply_job(request):
    serializer = JobApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def hotel_applications(request):
    hotel_name = request.GET.get('hotel_name')
    if not hotel_name:
        return Response({"error": "hotel_name is required"}, status=400)

    jobs = Job.objects.filter(hotel_name=hotel_name)
    job_ids = jobs.values_list('id', flat=True)
    applications = JobApplication.objects.filter(job_id__in=job_ids)
    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def applications_by_hotel(request):
    hotel_name = request.query_params.get('hotel')
    
    if not hotel_name:
        return Response({'error': 'Hotel name is required as a query parameter.'}, status=400)

    applications = JobApplication.objects.filter(job__hotel_name=hotel_name)
    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data)
