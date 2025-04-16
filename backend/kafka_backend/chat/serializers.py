from rest_framework import serializers
from .models import Conversation, ConversationMessage  # noqa
from useraccounts.serializers import UserDetailSerializer  # noqa


class ConversationListSerializer(serializers.ModelSerializer):
    users = UserDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ("id", "users", "modified_at")
