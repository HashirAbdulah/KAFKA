import uuid
from django.db import models
from useraccounts.models import User
# Create your models here.

class Conversation(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  users = models.ManyToManyField(User, related_name='conversations')
  created_at = models.DateTimeField(auto_now_add=True)
  modified_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return f"Conversation {self.id}"

class ConversationMessage(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
  conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
  body = models.TextField()
  sent_to = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
  created_by = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)
  #read timestamps
  read = models.BooleanField(default=False)
  read_at = models.DateTimeField(null=True, blank=True)

  def __str__(self):
    return f'{self.conversation.id} - {self.body[:20]}'

  class Meta:
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
            models.Index(fields=['sent_to', 'read']),
        ]
