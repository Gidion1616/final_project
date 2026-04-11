# views.py
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import JobSeeker
from .serializers import JobSeekerSerializer
from .serializers import JobSeekerLoginSerializer
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import permissions
from rest_framework.views import APIView

     



@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def register_jobseeker(request):
    serializer = JobSeekerSerializer(data=request.data)
    if serializer.is_valid():
        # Save the user and get the instance
        user = serializer.save()
        
        # Activate the user immediately after registration
        user.is_active = True
        user.save()
        
        return Response({
            'message': 'JobSeeker registered successfully',
            'email': user.email,
            'is_active': user.is_active  # Confirm activation
        }, status=status.HTTP_201_CREATED)
    
    return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)





from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
# from rest_framework.renderers import JSONRenderer
from .models import JobSeeker
from .serializers import JobSeekerSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_jobseeker(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = JobSeeker.objects.get(email=email)

        if not user.check_password(password):
            return Response(
                {"error": "Invalid email or password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        token, created = Token.objects.get_or_create(user=user)

        serializer = JobSeekerSerializer(user)

        return Response({
            "token": token.key,
            "user": serializer.data
        }, status=status.HTTP_200_OK)

    except JobSeeker.DoesNotExist:
        return Response(
            {"error": "Invalid email or password"},
            status=status.HTTP_400_BAD_REQUEST
        )




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
     

    return Response({
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "date_of_birth": user.date_of_birth,
        "gender": user.gender,
        "address": user.address,

        # ✅ CRITICAL FIX: return URL, not file object
        "cv": user.cv.url if user.cv else None,
        "photo": user.photo.url if user.photo else None,
        "certificate": user.certificate.url if user.certificate else None,
    })