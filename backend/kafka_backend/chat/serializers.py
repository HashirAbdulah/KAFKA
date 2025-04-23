from rest_framework import serializers
from .models import Conversation, ConversationMessage
from useraccounts.serializers import UserDetailSerializer

class MessageSerializer(serializers.ModelSerializer):
    created_by = UserDetailSerializer(read_only=True)
    sent_to = UserDetailSerializer(read_only=True)

    class Meta:
        model = ConversationMessage
        fields = ('id', 'body', 'created_by', 'sent_to', 'created_at', 'read', 'read_at')

class ConversationListSerializer(serializers.ModelSerializer):
    users = UserDetailSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ("id", "users", "modified_at", "last_message", "unread_count")

    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-created_at').first()
        if last_message:
            return MessageSerializer(last_message).data
        return None

    def get_unread_count(self, obj):
        user = self.context.get('request').user
        return obj.messages.filter(sent_to=user, read=False).count()


class ConversationDetailSerializer(serializers.ModelSerializer):
    users = UserDetailSerializer(many=True, read_only=True)
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ("id", "users", "modified_at", "messages")

    def get_messages(self, obj):
        # Get the most recent 50 messages
        messages = obj.messages.order_by('-created_at')[:50]
        # Reverse to show oldest first
        messages = reversed(messages)
        return MessageSerializer(messages, many=True).data
