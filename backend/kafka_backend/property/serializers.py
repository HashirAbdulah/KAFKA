from rest_framework import serializers
from .models import Property
# from useraccounts.serializers import UserDetailSerializer  # noqa


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
