from django.http import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from .models import Property, Reservation
from .serializers import (
    PropertiesListSerializer,
    PropertiesDetailSerializer,
    ReservationListSerializer,
)
from .forms import PropertyForm


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def properties_list(request):
    properties = Property.objects.all()
    landlord_id = request.GET.get("landlord_id", "")
    if landlord_id:
        properties = properties.filter(landlord_id=landlord_id)
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


@api_view(["POST"])
def book_property(request, pk):
    try:
        # Access data only once
        data = request.data
        print("Request data:", data)

        # Extract the data properly
        start_date = data.get("start_date", "")
        end_date = data.get("end_date", "")
        number_of_nights = data.get("number_of_nights", "")
        total_price = data.get("total_price", "")
        guests = data.get("guests", "")

        # Get the property
        property = Property.objects.get(pk=pk)

        # Create the reservation
        reservation = Reservation.objects.create(
            property=property,
            start_date=start_date,
            end_date=end_date,
            number_of_nights=int(number_of_nights),
            total_price=float(total_price),
            guests=int(guests),
            created_by=request.user,
        )

        print(f"Reservation created successfully: {reservation.id}")
        return JsonResponse({"success": True})
    except Exception as e:
        import traceback

        print(f"Booking error: {str(e)}")
        print(traceback.format_exc())  # This will print the full stack trace
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def property_reservation(request, pk):
    property = Property.objects.get(pk=pk)
    reservations = property.reservations.all()
    serializer = ReservationListSerializer(reservations, many=True)
    return JsonResponse({"data": serializer.data}, safe=False)
