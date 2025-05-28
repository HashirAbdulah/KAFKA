import uuid
from django.db import models
from useraccounts.models import User
from django.utils import timezone
# Create your models here.


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    users = models.ManyToManyField(User, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Conversation {self.id}"

    def update_last_message(self):
        self.last_message_at = timezone.now()
        self.save(update_fields=["last_message_at"])


class ConversationMessage(models.Model):
    MESSAGE_TYPES = [
        ("text", "Text"),
        ("image", "Image"),
        ("file", "File"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, related_name="messages", on_delete=models.CASCADE
    )
    body = models.TextField()
    sent_to = models.ForeignKey(
        User, related_name="received_messages", on_delete=models.CASCADE
    )
    created_by = models.ForeignKey(
        User, related_name="sent_messages", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    message_type = models.CharField(
        max_length=20, choices=MESSAGE_TYPES, default="text"
    )
    media_url = models.URLField(null=True, blank=True)
    file_name = models.CharField(max_length=255, null=True, blank=True)
    file_size = models.IntegerField(null=True, blank=True)
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    reply_to = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="replies"
    )
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.conversation.id} - {self.body[:20]}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            self.conversation.update_last_message()

    class Meta:
        indexes = [
            models.Index(fields=["conversation", "created_at"]),
            models.Index(fields=["sent_to", "read"]),
            models.Index(fields=["message_type"]),
            models.Index(fields=["created_by", "created_at"]),
        ]
        ordering = ["created_at"]


class TypingStatus(models.Model):
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="typing_statuses"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="typing_statuses"
    )
    is_typing = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["conversation", "user"]
        indexes = [
            models.Index(fields=["conversation", "user"]),
            models.Index(fields=["is_typing"]),
        ]

    def __str__(self):
        return f"{self.user.name} - {'typing' if self.is_typing else 'not typing'}"
