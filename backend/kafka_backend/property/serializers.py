from rest_framework import serializers
from .models import Property, Reservation, PropertyImage
from useraccounts.serializers import UserDetailSerializer  # noqa


class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        return obj.image_url()

    class Meta:
        model = PropertyImage
        fields = ["id", "image_url", "is_primary", "order"]


class PropertiesListSerializer(serializers.ModelSerializer):
    landlord_id = serializers.SerializerMethodField()
    primary_image_url = serializers.SerializerMethodField()

    def get_landlord_id(self, obj):
        return str(obj.landlord.id)

    def get_primary_image_url(self, obj):
        return obj.image_url()

    class Meta:
        model = Property
        fields = (
            "id",
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
            "primary_image_url",
            "category",
            "landlord_id",
        )


class PropertiesDetailSerializer(serializers.ModelSerializer):
    landlord = UserDetailSerializer(read_only=True, many=False)
    images = PropertyImageSerializer(many=True, read_only=True)
    primary_image_url = serializers.SerializerMethodField()

    def get_primary_image_url(self, obj):
        # First try to get the primary image URL
        if obj.primary_image:
            return obj.image_url()

        # If no primary image, try to get the first image from the images list
        first_image = obj.images.filter(is_primary=True).first()
        if first_image:
            return first_image.image_url()

        # If no images at all, return None
        return None

    class Meta:
        model = Property
        fields = (
            "id",
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
            "primary_image_url",
            "images",
            "category",
            "landlord",
        )


class ReservationListSerializer(serializers.ModelSerializer):
    property = PropertiesDetailSerializer(read_only=True, many=False)

    class Meta:
        model = Reservation
        fields = (
            "id",
            "start_date",
            "end_date",
            "number_of_nights",
            "total_price",
            "property",
        )
