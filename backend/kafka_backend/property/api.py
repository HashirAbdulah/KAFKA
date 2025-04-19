from django.http import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated
from .models import Property, Reservation
from .serializers import (
    PropertiesListSerializer,
    PropertiesDetailSerializer,
    ReservationListSerializer,
)
from .forms import PropertyForm
from useraccounts.models import User


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def properties_list(request):
    # Try to get the authenticated user
    user = None
    try:
        token = request.META.get("HTTP_AUTHORIZATION", "").split("Bearer ")[1].strip()
        token = AccessToken(token)
        user_id = token.payload.get("user_id")
        if user_id:
            user = User.objects.get(pk=user_id)
    except IndexError:
        print("Token not found in the request header.")
    except KeyError:
        print("User ID not found in the token payload.")
    except User.DoesNotExist:
        print("User does not exist.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    # Get properties with optional landlord filter
    properties = Property.objects.all()
    is_favourties = request.GET.get("is_favourites", "")
    landlord_id = request.GET.get("landlord_id", "")
    country = request.GET.get("country", "")
    category = request.GET.get("category", "")
    checkin_date = request.GET.get("checkin", "")
    checkout_date = request.GET.get("checkOut", "")
    bedrooms = request.GET.get("numBedrooms", "")
    guests = request.GET.get("numGuests", "")
    bathrooms = request.GET.get("numBathrooms", "")
    if checkin_date and checkout_date:
        exact_matches = Reservation.objects.filter(start_date=checkin_date) | Reservation.objects.filter(end_date=checkout_date)
        overlap_matches = Reservation.objects.filter(start_date__lte=checkout_date, end_date__gte=checkin_date)
        all_matches = []

        for reservation in exact_matches or overlap_matches:
            all_matches.append(reservation.property_id)

        properties = properties.exclude(id__in=all_matches)

    if landlord_id:
        properties = properties.filter(landlord_id=landlord_id)

    if is_favourties:
        properties = properties.filter(favourited__in=[user])

    if guests:
        properties = properties.filter(guests__gte=guests)

    if bedrooms:
        properties = properties.filter(bedrooms__gte=bedrooms)

    if bathrooms:
        properties = properties.filter(bathrooms__gte=bathrooms)

    if country:
        properties = properties.filter(country=country)

    if category and category != 'undefined':
        properties = properties.filter(category=category)

    # Serialize properties
    serializer = PropertiesListSerializer(properties, many=True)
    properties_data = serializer.data

    # Initialize favorite_ids to an empty set
    favorite_ids = set()

    # Add is_favourite field to each property if user is authenticated
    if user:
        print("User:", user)
        for property in properties:
            print("Property:", property)  # Debug: Print each property
            if user in property.favourited.all():
                favorite_ids.add(str(property.id))  # Convert UUID to string if needed
                print(
                    f"Property {property.id} is favourited by user {user}"
                )  # Debug: Print when a property is favourited

        print("Favourites:", favorite_ids)

        # Add is_favourite flag to each property in the serialized data
        for property_data in properties_data:
            property_data["is_favourite"] = property_data["id"] in favorite_ids
            print(
                "Property Data:", property_data
            )  # Debug: Print each property data with is_favourite flag

        print(
            "Final Property Data:", properties_data
        )  # Debug: Print the final properties data

    return JsonResponse(
        {
            "properties": properties_data,
            "favourites": list(
                favorite_ids
            ),  # Convert set to list for JSON serialization
        }
    )


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


@api_view(["POST"])
def toggle_favourite(request, pk):
    property = Property.objects.get(pk=pk)
    if request.user in property.favourited.all():
        property.favourited.remove(request.user)
        return JsonResponse({"is_favourite": False})
    else:
        property.favourited.add(request.user)
        return JsonResponse({"is_favourite": True})
