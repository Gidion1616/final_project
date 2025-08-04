from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Hotel

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response


@csrf_exempt
def register_hotel(request):
    if request.method == "OPTIONS":
        # Respond to preflight CORS request
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("hotelName")
            email = data.get("email")
            password = data.get("password")

            if not all([name, email, password]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            if Hotel.objects.filter(email=email).exists():
                return JsonResponse({"error": "Hotel with this email already exists"}, status=400)

            Hotel.objects.create(name=name, email=email, password=password)

            response = JsonResponse({"message": "Hotel registered successfully"}, status=201)
            response["Access-Control-Allow-Origin"] = "*"
            return response

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        hotel = token.user  # assuming hotel is a user object
        return Response({
            'token': token.key,
            'hotel_id': hotel.id,
            'hotel_name': hotel.hotel.name if hasattr(hotel, 'hotel') else hotel.username,
            'email': hotel.email,
        })
