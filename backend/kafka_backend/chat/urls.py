from django.urls import path

from . import api

urlpatterns = [
    path("conversations/", api.conversations_list, name="conversations_list"),
    path(
        "conversations/<uuid:pk>/",
        api.conversations_detail,
        name="conversations_detail",
    ),
    path(
        "conversations/start/<uuid:user_id>/",
        api.conversations_start,
        name="conversations_start",
    ),
    path(
        "conversations/<uuid:pk>/messages/",
        api.conversation_messages,
        name="conversation_messages",
    ),
    path("messages/<uuid:message_id>/edit/", api.edit_message, name="edit_message"),
    path(
        "messages/<uuid:message_id>/delete/", api.delete_message, name="delete_message"
    ),
    path(
        "conversations/<uuid:conversation_id>/search/",
        api.search_messages,
        name="search_messages",
    ),
    path(
        "conversations/<uuid:conversation_id>/typing-status/",
        api.get_typing_status,
        name="get_typing_status",
    ),
    path("upload/", api.upload_file, name="upload_file"),
]
