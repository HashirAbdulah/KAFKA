from django.urls import path

from . import api

urlpatterns = [
    path('', api.conversations_list, name="api_conversations_list"),
    path('<uuid:pk>/', api.conversations_detail, name='api_conversations_detail'),
    path('start/<uuid:user_id>/', api.conversations_start, name='api_conversations_start'),
    path('<uuid:pk>/messages/', api.conversation_messages, name='api_conversation_messages')
]
