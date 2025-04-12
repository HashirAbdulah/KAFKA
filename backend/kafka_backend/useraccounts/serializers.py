from rest_framework import serializers
from .models import User


class UserDetailSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields =(
      'id',
      'name',
      'email',
      'profile_image_url',
    )
