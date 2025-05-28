from rest_framework import serializers
from .models import Conversation, ConversationMessage, TypingStatus
from useraccounts.serializers import UserDetailSerializer


class MessageSerializer(serializers.ModelSerializer):
    created_by = UserDetailSerializer(read_only=True)
    reply_to = serializers.SerializerMethodField()
    message_type_display = serializers.CharField(
        source="get_message_type_display", read_only=True
    )

    class Meta:
        model = ConversationMessage
        fields = [
            "id",
            "body",
            "created_by",
            "created_at",
            "read",
            "read_at",
            "message_type",
            "message_type_display",
            "media_url",
            "file_name",
            "file_size",
            "is_edited",
            "edited_at",
            "reply_to",
        ]
        read_only_fields = ["created_by", "created_at", "read", "read_at"]

    def get_reply_to(self, obj):
        if obj.reply_to:
            return {
                "id": obj.reply_to.id,
                "body": obj.reply_to.body,
                "created_by": UserDetailSerializer(obj.reply_to.created_by).data,
                "created_at": obj.reply_to.created_at,
                "message_type": obj.reply_to.message_type,
            }
        return None


class ConversationListSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "other_user", "last_message", "unread_count", "last_message_at"]

    def get_other_user(self, obj):
        request = self.context.get("request")
        if request and request.user:
            other_user = obj.users.exclude(id=request.user.id).first()
            if other_user:
                return UserDetailSerializer(other_user).data
        return None

    def get_last_message(self, obj):
        last_message = obj.messages.order_by("-created_at").first()
        if last_message:
            return {
                "id": last_message.id,
                "body": last_message.body,
                "created_at": last_message.created_at,
                "message_type": last_message.message_type,
                "created_by": UserDetailSerializer(last_message.created_by).data,
            }
        return None

    def get_unread_count(self, obj):
        request = self.context.get("request")
        if request and request.user:
            return obj.messages.filter(sent_to=request.user, read=False).count()
        return 0


class ConversationDetailSerializer(serializers.ModelSerializer):
    users = UserDetailSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    other_user = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ["id", "users", "messages", "other_user", "created_at", "modified_at"]

    def get_other_user(self, obj):
        request = self.context.get("request")
        if request and request.user:
            other_user = obj.users.exclude(id=request.user.id).first()
            if other_user:
                return UserDetailSerializer(other_user).data
        return None


class TypingStatusSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)

    class Meta:
        model = TypingStatus
        fields = ["id", "user", "is_typing", "last_updated"]
        read_only_fields = ["last_updated"]
