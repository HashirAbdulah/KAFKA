from django.http import JsonResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated
from .models import Property, Reservation, PropertyImage
from .serializers import (
    PropertiesListSerializer,
    PropertiesDetailSerializer,
    ReservationListSerializer,
)
from .forms import PropertyForm
from useraccounts.models import User
from django.db.models import Q
from django.db import transaction


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
        # Combine both queries into one
        unavailable_properties = Reservation.objects.filter(
            Q(start_date=checkin_date)
            | Q(end_date=checkout_date)
            | Q(start_date__lte=checkout_date, end_date__gte=checkin_date)
        ).values_list("property_id", flat=True)

        properties = properties.exclude(id__in=unavailable_properties)

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

    if category and category != "undefined":
        properties = properties.filter(category=category)

    # Get all favorite properties in a single query if user is authenticated
    favorite_ids = set()
    if user:
        favorite_ids = set(
            str(id) for id in user.favourites.values_list("id", flat=True)
        )

    # Serialize properties
    serializer = PropertiesListSerializer(properties, many=True)
    properties_data = serializer.data

    # Add is_favourite flag using our pre-fetched favorites
    for property_data in properties_data:
        property_data["is_favourite"] = property_data["id"] in favorite_ids

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
    try:
        property = Property.objects.get(pk=pk)
        serializer = PropertiesDetailSerializer(property, many=False)
        return JsonResponse({"property": serializer.data})
    except Property.DoesNotExist:
        print(f"Property not found with id: {pk}")
        return JsonResponse(
            {"success": False, "error": "Property not found"}, status=404
        )
    except Exception as e:
        print(f"Error fetching property detail: {str(e)}")
        return JsonResponse(
            {"success": False, "error": "Error fetching property details"}, status=500
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_property(request):
    try:
        print("Request data:", request.POST, request.FILES)  # Debug log

        # First create the property
        property_form = PropertyForm(request.POST, request.FILES)
        if not property_form.is_valid():
            print("Property form errors:", property_form.errors)  # Debug log
            return JsonResponse(
                {"success": False, "errors": property_form.errors}, status=400
            )

        # Create property with transaction to ensure data consistency
        with transaction.atomic():
            property = property_form.save(commit=False)
            property.landlord = request.user
            property.save()

            # Handle images
            images = request.FILES.getlist("images", [])

            # Validate number of images
            if len(images) > 5:
                return JsonResponse(
                    {"success": False, "error": "You can upload a maximum of 5 images"},
                    status=400,
                )

            if len(images) < 1:
                return JsonResponse(
                    {"success": False, "error": "You must upload at least one image"},
                    status=400,
                )

            # Process each image
            for i, image_file in enumerate(images):
                # Validate image type
                if not image_file.name.lower().endswith((".jpg", ".jpeg", ".png", "avif", "heic")):
                    return JsonResponse(
                        {
                            "success": False,
                            "error": f"Invalid file type for {image_file.name}. Only JPG, JPEG, PNG, AVIF and HEIC  files are allowed.",
                        },
                        status=400,
                    )

                # Validate image size (5MB limit)
                if image_file.size > 5 * 1024 * 1024:
                    return JsonResponse(
                        {
                            "success": False,
                            "error": f"Image {image_file.name} is too large. Maximum size is 5MB.",
                        },
                        status=400,
                    )

                # Create image
                is_primary = i == 0  # First image is primary
                PropertyImage.objects.create(
                    property=property,
                    image=image_file,
                    is_primary=is_primary,
                    order=i,
                )

                # Set primary image for property
                if is_primary:
                    property.primary_image = image_file
                    property.save()

            return JsonResponse({"success": True, "id": str(property.id)})
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


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_property(request, pk):
    try:
        property = Property.objects.get(pk=pk)
        # Check if the user is the landlord of the property
        if property.landlord != request.user:
            return JsonResponse(
                {
                    "success": False,
                    "error": "You are not authorized to delete this property",
                },
                status=403,
            )

        # Delete the property
        property.delete()
        return JsonResponse({"success": True})
    except Property.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Property not found"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_property(request, pk):
    try:
        print("Update property request data:", request.POST, request.FILES)  # Debug log
        property = Property.objects.get(pk=pk)

        # Check if the user is the landlord of the property
        if property.landlord != request.user:
            return JsonResponse(
                {
                    "success": False,
                    "error": "You are not authorized to update this property",
                },
                status=403,
            )

        # Update the property using the form
        with transaction.atomic():
            post_data = request.POST.copy()
            # Ensure all required fields are present
            required_fields = [
                "title",
                "description",
                "price_per_night",
                "guests",
                "bedrooms",
                "bathrooms",
                "country",
                "country_code",
                "state_province",
                "city",
                "street_address",
                "postal_code",
                "category",
            ]
            for field in required_fields:
                if field not in post_data:
                    return JsonResponse(
                        {
                            "success": False,
                            "error": f"Missing required field: {field}",
                        },
                        status=400,
                    )
            # Convert numeric fields to integers
            try:
                post_data["price_per_night"] = int(post_data["price_per_night"])
                post_data["guests"] = int(post_data["guests"])
                post_data["bedrooms"] = int(post_data["bedrooms"])
                post_data["bathrooms"] = int(post_data["bathrooms"])
            except (ValueError, TypeError) as e:
                return JsonResponse(
                    {
                        "success": False,
                        "error": f"Invalid numeric value: {str(e)}",
                    },
                    status=400,
                )
            property_form = PropertyForm(post_data, request.FILES, instance=property)
            if not property_form.is_valid():
                print("Property form errors:", property_form.errors)  # Debug log
                return JsonResponse(
                    {"success": False, "errors": property_form.errors}, status=400
                )
            property = property_form.save()
            # Handle images
            current_images = request.POST.getlist("current_images", [])
            new_images = request.FILES.getlist("images", [])
            print(f"Current images: {current_images}")  # Debug log
            print(f"New images: {[img.name for img in new_images]}")  # Debug log
            # Validate total number of images
            total_images = len(current_images) + len(new_images)
            if total_images > 5:
                return JsonResponse(
                    {
                        "success": False,
                        "error": "You can have a maximum of 5 images in total",
                    },
                    status=400,
                )
            if total_images < 1:
                return JsonResponse(
                    {"success": False, "error": "You must have at least one image"},
                    status=400,
                )
            # Get existing image URLs (filenames only)
            existing_image_urls = {
                img.image_url().split("/")[-1]: img for img in property.images.all()
            }
            # Delete images that are not in current_images
            images_to_delete = [
                img_obj
                for img_url, img_obj in existing_image_urls.items()
                if img_url not in current_images
            ]
            for img in images_to_delete:
                img.delete()
            # Add new images
            start_order = property.images.count()
            for i, image_file in enumerate(new_images):
                # Validate image type
                if not image_file.name.lower().endswith((".jpg", ".jpeg", ".png", "avif", "heic")):
                    return JsonResponse(
                        {
                            "success": False,
                            "error": f"Invalid file type for {image_file.name}. Only JPG, JPEG, PNG, AVIF and HEIC files are allowed.",
                        },
                        status=400,
                    )
                # Validate image size (5MB limit)
                if image_file.size > 5 * 1024 * 1024:
                    return JsonResponse(
                        {
                            "success": False,
                            "error": f"Image {image_file.name} is too large. Maximum size is 5MB.",
                        },
                        status=400,
                    )
                # Create new image
                is_primary = i == 0 and not property.primary_image
                try:
                    PropertyImage.objects.create(
                        property=property,
                        image=image_file,
                        is_primary=is_primary,
                        order=start_order + i,
                    )
                    if is_primary:
                        property.primary_image = image_file
                        property.save()
                except Exception as e:
                    print(f"Error creating image {image_file.name}: {str(e)}")
                    raise
            return JsonResponse({"success": True})
    except Property.DoesNotExist:
        print(f"Property not found with id: {pk}")
        return JsonResponse(
            {"success": False, "error": "Property not found"}, status=404
        )
    except Exception as e:
        import traceback

        print(f"Error updating property: {str(e)}")
        print(traceback.format_exc())
        return JsonResponse(
            {"success": False, "error": f"Error updating property: {str(e)}"},
            status=500,
        )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_property_image(request, pk, image_id):
    try:
        property = Property.objects.get(pk=pk)

        # Check if the user is the landlord of the property
        if property.landlord != request.user:
            return JsonResponse(
                {
                    "success": False,
                    "error": "You are not authorized to delete this image",
                },
                status=403,
            )

        image = PropertyImage.objects.get(pk=image_id, property=property)

        # If this is the primary image, update the property's primary_image
        if image.is_primary:
            next_image = property.images.exclude(id=image_id).first()
            if next_image:
                property.primary_image = next_image.image
                next_image.is_primary = True
                next_image.save()
            else:
                property.primary_image = None
            property.save()

        image.delete()
        return JsonResponse({"success": True})
    except (Property.DoesNotExist, PropertyImage.DoesNotExist):
        return JsonResponse(
            {"success": False, "error": "Property or image not found"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def set_primary_image(request, pk, image_id):
    try:
        property = Property.objects.get(pk=pk)

        # Check if the user is the landlord of the property
        if property.landlord != request.user:
            return JsonResponse(
                {
                    "success": False,
                    "error": "You are not authorized to update this image",
                },
                status=403,
            )

        with transaction.atomic():
            # Set all images as non-primary
            property.images.update(is_primary=False)

            # Set the selected image as primary
            image = PropertyImage.objects.get(pk=image_id, property=property)
            image.is_primary = True
            image.save()

            # Update property's primary_image
            property.primary_image = image.image
            property.save()

        return JsonResponse({"success": True})
    except (Property.DoesNotExist, PropertyImage.DoesNotExist):
        return JsonResponse(
            {"success": False, "error": "Property or image not found"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
