from django.http import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from .models import Property
from .serializers import PropertiesListSerializer, PropertiesDetailSerializer
from .forms import PropertyForm  # noqa


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def properties_list(request):
    properties = Property.objects.all()
    serializer = PropertiesListSerializer(properties, many=True)

    return JsonResponse({"properties": serializer.data})


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def properties_detail(request, pk):
    properties = Property.objects.get(pk=pk)
    serializer = PropertiesDetailSerializer(properties, many=False)
    return JsonResponse({"property": serializer.data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_property(request):
    try:
        print("Request data:", request.POST, request.FILES)  # Debug log
        form = PropertyForm(request.POST, request.FILES)
        if form.is_valid():
            property = form.save(commit=False)
            property.landlord = request.user
            property.save()
            return JsonResponse({"success": True, "id": str(property.id)})
        else:
            print("Form errors:", form.errors)  # Debug log
            return JsonResponse({"success": False, "errors": form.errors}, status=400)
    except Exception as e:
        print("Exception:", str(e))  # Debug log
        return JsonResponse({"success": False, "error": str(e)}, status=500)
