from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

from .serializers import HotelRegisterSerializer, HotelLoginSerializer


# -------------------------
# HOTEL REGISTER
# -------------------------
class HotelRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = HotelRegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": "Hotel registered successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# HOTEL LOGIN
# -------------------------
class HotelLoginView(APIView):
    permission_classes = [AllowAny]  # login should be public

    def post(self, request):
        serializer = HotelLoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Get hotel profile safely
            hotel_profile = getattr(user, 'hotel_profile', None)

            # Create or get token (TokenAuth system)
            token, created = Token.objects.get_or_create(user=user)

            return Response({
                "hotel_name": hotel_profile.hotel_name if hotel_profile else "",
                "hotel_id": hotel_profile.id if hotel_profile else "",
                "email": user.email,
                "token": token.key,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)