from rest_framework import serializers
from .models import User


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "profile_image", "date_joined", "last_login"]


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "profile_image",
            "phone_number",
            "gender",
            "bio",
            "location",
            "interests",
            "occupation",
            "education",
            "is_email_verified",
            "is_phone_verified",
            "is_identity_verified",
            "show_email_publicly",
            "show_phone_publicly",
            "active_sessions",
            "date_joined",
            "last_login",
        ]
        read_only_fields = [
            "id",
            "email",
            "date_joined",
            "last_login",
            "is_email_verified",
            "is_phone_verified",
            "is_identity_verified",
        ]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "name",
            "profile_image",
            "phone_number",
            "gender",
            "bio",
            "location",
            "interests",
            "occupation",
            "education",
            "show_email_publicly",
            "show_phone_publicly",
        ]


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("New passwords don't match")
        return data


class PrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["show_email_publicly", "show_phone_publicly"]


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("name", "email", "password1", "password2")

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError({"password2": "Passwords don't match."})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password1")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
