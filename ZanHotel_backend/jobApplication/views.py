from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import JobApplication, Job
from .serializers import JobApplicationSerializer


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def apply_job(request):
    serializer = JobApplicationSerializer(
        data=request.data,
        context={"request": request}
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


 
@api_view(['GET', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def applications_for_hotel(request):

    # GET: list applications for hotel's jobs
    if request.method == 'GET':
        applications = JobApplication.objects.filter(
            job__hotel=request.user
        ).order_by('-applied_at')

        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    # PATCH: update status
    elif request.method == 'PATCH':
        app_id = request.data.get('id')
        new_status = request.data.get('status')

        if not app_id or not new_status:
            return Response(
                {"error": "Provide application ID and new status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            application = JobApplication.objects.get(
                id=app_id,
                job__hotel=request.user
            )
        except JobApplication.DoesNotExist:
            return Response(
                {"error": "Application not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        application.status = new_status
        application.save()

        serializer = JobApplicationSerializer(application)
        return Response(serializer.data)
    
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def my_applications(request):
    applications = JobApplication.objects.filter(jobseeker=request.user)
    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_application(request, pk):
    try:
        application = JobApplication.objects.get(id=pk, jobseeker=request.user)
        application.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)

    except JobApplication.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_hotel_application(request, pk):
    hotel = request.user.hotel_profile.hotel

    try:
        app = JobApplication.objects.get(id=pk, job__hotel=hotel)
        app.delete()
        return Response({"message": "Deleted"})
    except JobApplication.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def clear_all_applications(request):
    hotel = request.user.hotel_profile.hotel

    JobApplication.objects.filter(job__hotel=hotel).delete()

    return Response({"message": "All applications deleted"})