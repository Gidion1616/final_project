from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import HotelRegisterSerializer,HotelLoginSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import permissions 



class HotelRegisterView(APIView):
    def post(self, request):
        serializer = HotelRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Hotel registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




csrf_exempt
class HotelLoginView(APIView):
    authentication_classes = []  # no auth needed to login
    permission_classes = []
    def post(self, request):
        serializer = HotelLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            hotel_profile = getattr(user, 'hotel_profile', None)  # existing logic

            # -------------------------
            # Create or get token
            # -------------------------
            token, created = Token.objects.get_or_create(user=user)

            return Response({
                "hotel_name": hotel_profile.hotel_name if hotel_profile else "",
                "hotel_id": hotel_profile.id if hotel_profile else "",
                "email": user.email,
                "token": token.key,  # <-- send token in response
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)









# this work without token

# class HotelLoginView(APIView):
#     def post(self, request):
#         serializer = HotelLoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.validated_data['user']
#             hotel_profile = getattr(user, 'hotel_profile', None)  # works now

#             return Response({
#                 "hotel_name": hotel_profile.hotel_name if hotel_profile else "",
#                 "hotel_id": hotel_profile.id if hotel_profile else "",
#                 "email": user.email,
#             })
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class HotelLoginView(APIView):
#     def post(self, request):
#         serializer = HotelLoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.validated_data['user']  # now this exists
#             hotel_profile = getattr(user, 'hotel_profile', None)
#             return Response({
#                 "hotel_name": hotel_profile.hotel_name if hotel_profile else "",
#                 "hotel_id": hotel_profile.id if hotel_profile else "",
#                 "email": user.email,
#             })
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HotelDashboardView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        hotel = request.user
        return Response({
            "hotel_id": hotel.id,
            "hotel_name": hotel.hotel_name,
            "email": hotel.email,
            "message": "Welcome to your dashboard"
        })