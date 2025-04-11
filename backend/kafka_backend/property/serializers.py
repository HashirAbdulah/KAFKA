from rest_framework import serializers
from .models import Property, Reservation
from useraccounts.serializers import UserDetailSerializer  # noqa


class PropertiesListSerializer(serializers.ModelSerializer):
  class Meta:
    model = Property
    fields = (
      'id',
      'title',
      'description',
      'price_per_night',
      'guests',
      'bedrooms',
      'bathrooms',
      'country',
      'country_code',
      'image_url',
      'category',
    )


class PropertiesDetailSerializer(serializers.ModelSerializer):
  landlord = UserDetailSerializer(read_only=True, many=False)
  class Meta:
    model = Property
    fields = (
      'id',
      'title',
      'description',
      'price_per_night',
      'guests',
      'bedrooms',
      'bathrooms',
      'country',
      'country_code',
      'image_url',
      'category',
      'landlord',
    )

class ReservationListSerializer(serializers.ModelSerializer):
  property = PropertiesDetailSerializer(read_only=True, many=False)

  class Meta:
    model = Reservation
    fields = (
      'id',
      'start_date',
      'end_date',
      'number_of_nights',
      'total_price',
      'property',
    )
