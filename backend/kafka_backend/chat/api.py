from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, ConversationMessage, TypingStatus
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    MessageSerializer,
    TypingStatusSerializer,
)
from rest_framework.pagination import PageNumberPagination
from useraccounts.models import User
from django.utils import timezone
from django.db.models import Q
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
import uuid


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversations_list(request):
    try:
        conversations = request.user.conversations.all().order_by("-last_message_at")
        serializer = ConversationListSerializer(
            conversations, many=True, context={"request": request}
        )
        return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversations_detail(request, pk):
    try:
        conversation = request.user.conversations.get(pk=pk)
        conversation_serializer = ConversationDetailSerializer(
            conversation, context={"request": request}
        )
        return JsonResponse(conversation_serializer.data, safe=False)
    except Conversation.DoesNotExist:
        return JsonResponse({"error": "Conversation not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversations_start(request, user_id):
    try:
        conversations = Conversation.objects.filter(users__in=[user_id]).filter(
            users__in=[request.user.id]
        )

        if conversations.exists():
            conversation = conversations.first()
            return JsonResponse({"success": True, "conversation_id": conversation.id})
        else:
            user = User.objects.get(pk=user_id)
            conversation = Conversation.objects.create()
            conversation.users.add(user, request.user)
            return JsonResponse({"success": True, "conversation_id": conversation.id})
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


class MessagePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 50


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversation_messages(request, pk):
    try:
        conversation = request.user.conversations.get(pk=pk)

        # Mark messages as read
        if request.query_params.get("mark_read", "true").lower() == "true":
            ConversationMessage.objects.filter(
                conversation=conversation, sent_to=request.user, read=False
            ).update(read=True, read_at=timezone.now())

        # Get paginated messages
        messages = conversation.messages.order_by("-created_at")
        paginator = MessagePagination()
        paginated_messages = paginator.paginate_queryset(messages, request)

        serializer = MessageSerializer(paginated_messages, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Conversation.DoesNotExist:
        return JsonResponse({"error": "Conversation not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def edit_message(request, message_id):
    try:
        message = ConversationMessage.objects.get(
            id=message_id, created_by=request.user
        )

        new_body = request.data.get("body")
        if not new_body:
            return JsonResponse({"error": "Message body is required"}, status=400)

        message.body = new_body
        message.is_edited = True
        message.edited_at = timezone.now()
        message.save(update_fields=["body", "is_edited", "edited_at"])

        serializer = MessageSerializer(message)
        return JsonResponse(serializer.data)
    except ConversationMessage.DoesNotExist:
        return JsonResponse({"error": "Message not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_message(request, message_id):
    try:
        message = ConversationMessage.objects.get(
            id=message_id, created_by=request.user
        )
        message.delete()
        return JsonResponse({"success": True})
    except ConversationMessage.DoesNotExist:
        return JsonResponse({"error": "Message not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_messages(request, conversation_id):
    try:
        query = request.query_params.get("q", "")
        if not query:
            return JsonResponse({"error": "Search query is required"}, status=400)

        conversation = request.user.conversations.get(id=conversation_id)
        messages = conversation.messages.filter(
            Q(body__icontains=query) | Q(file_name__icontains=query)
        ).order_by("-created_at")

        paginator = MessagePagination()
        paginated_messages = paginator.paginate_queryset(messages, request)

        serializer = MessageSerializer(paginated_messages, many=True)
        return paginator.get_paginated_response(serializer.data)
    except Conversation.DoesNotExist:
        return JsonResponse({"error": "Conversation not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_typing_status(request, conversation_id):
    try:
        conversation = request.user.conversations.get(id=conversation_id)
        typing_statuses = TypingStatus.objects.filter(
            conversation=conversation,
            is_typing=True,
            last_updated__gte=timezone.now() - timezone.timedelta(seconds=5),
        ).exclude(user=request.user)

        serializer = TypingStatusSerializer(typing_statuses, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Conversation.DoesNotExist:
        return JsonResponse({"error": "Conversation not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_file(request):
    try:
        if "file" not in request.FILES:
            return JsonResponse({"error": "No file provided"}, status=400)

        file = request.FILES["file"]
        conversation_id = request.POST.get("conversation_id")
        message_type = request.POST.get("message_type", "file")

        if not conversation_id:
            return JsonResponse({"error": "Conversation ID is required"}, status=400)

        # Verify user is part of the conversation
        conversation = Conversation.objects.get(id=conversation_id, users=request.user)
        if not conversation:
            return JsonResponse({"error": "Conversation not found"}, status=404)

        # Generate unique filename
        ext = os.path.splitext(file.name)[1]
        filename = f"{uuid.uuid4()}{ext}"

        # Determine upload path based on message type
        if message_type == "image":
            path = f"chat/images/{filename}"
        else:
            path = f"chat/files/{filename}"

        # Save file
        file_path = default_storage.save(path, ContentFile(file.read()))
        file_url = default_storage.url(file_path)

        return JsonResponse(
            {
                "success": True,
                "media_url": file_url,
                "file_name": file.name,
                "file_size": file.size,
                "message_type": message_type,
            }
        )
    except Conversation.DoesNotExist:
        return JsonResponse({"error": "Conversation not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
