from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Conversation, ConversationMessage
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    MessageSerializer,
)  # noqa
from rest_framework.pagination import PageNumberPagination
from useraccounts.models import User

@api_view(["GET"])
def conversations_list(request):
    conversations = request.user.conversations.all()
    serializer = ConversationListSerializer(
        conversations, many=True, context={"request": request}
    )
    return JsonResponse(serializer.data, safe=False)


@api_view(["GET"])
def conversations_detail(request, pk):
    try:
        conversation = request.user.conversations.get(pk=pk)
        conversation_serializer = ConversationDetailSerializer(
            conversation, context={"request": request}
        )
        return JsonResponse(conversation_serializer.data, safe=False)
    except Conversation.DoesNotExist:
        return JsonResponse({"error": "Conversation not found"}, status=404)

@api_view(['GET'])
def conversations_start(request, user_id):
  conversations = Conversation.objects.filter(users__in= [user_id]).filter(users__in = [request.user.id])

  if conversations.count():
      conversation = conversations.first()
      return JsonResponse({'success': True, 'conversation_id': conversation.id})
  else:
      user = User.objects.get(pk = user_id)
      conversation = Conversation.objects.create()
      conversation.users.add(user, request.user)
      return JsonResponse({'success': True, 'conversation_id': conversation.id})


class MessagePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 50

@api_view(["GET"])
def conversation_messages(request, pk):
    try:
        conversation = request.user.conversations.get(pk=pk)

        # Mark messages as read
        if request.query_params.get("mark_read", "true").lower() == "true":
            ConversationMessage.objects.filter(
                conversation=conversation, sent_to=request.user, read=False
            ).update(read=True)

        # Get paginated messages
        messages = conversation.messages.order_by("-created_at")
        paginator = MessagePagination()
        paginated_messages = paginator.paginate_queryset(messages, request)

        serializer = MessageSerializer(paginated_messages, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Conversation.DoesNotExist:
        return JsonResponse({"error": "Conversation not found"}, status=404)
