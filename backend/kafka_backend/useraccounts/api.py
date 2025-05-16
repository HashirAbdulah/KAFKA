from .serializers import (
    UserDetailSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    PasswordChangeSerializer,
    PrivacySettingsSerializer,
)
from .models import User
from django.http import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import update_session_auth_hash
from property.serializers import ReservationListSerializer


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def landlord_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
        serializer = UserDetailSerializer(user, many=False)
        return JsonResponse(serializer.data, safe=False)
    except User.DoesNotExist:
        return JsonResponse(
            {"error": "Landlord not found"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return JsonResponse(
            {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def reservations_list(request):
    reservations = request.user.created_reservations.all()
    # print('user', request.user)
    # print(reservations)
    serializer = ReservationListSerializer(reservations, many=True)
    return JsonResponse(serializer.data, safe=False)


# New Profile Management Endpoints
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserProfileUpdateSerializer(
        request.user, data=request.data, partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = PasswordChangeSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        update_session_auth_hash(request, user)
        return Response({"message": "Password successfully updated."})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_privacy_settings(request):
    serializer = PrivacySettingsSerializer(request.user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_active_sessions(request):
    return Response(request.user.active_sessions)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_session(request):
    session_id = request.data.get("session_id")
    if session_id:
        request.user.remove_active_session(session_id)
        return Response({"message": "Session logged out successfully."})
    return Response(
        {"error": "Session ID required."}, status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_phone(request):
    # Implement phone verification logic here
    # This is a placeholder for the actual implementation
    return Response({"message": "Phone verification initiated."})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_identity(request):
    # Implement identity verification logic here
    # This is a placeholder for the actual implementation
    return Response({"message": "Identity verification initiated."})
