from django.http import JsonResponse #noqa
from rest_framework.decorators import api_view
from .models import Conversation #noqa
from .serializers import ConversationListSerializer #noqa

@api_view(['GET'])
def conversations_list(request):
  conversations = request.user.conversations.all()
  serializer = ConversationListSerializer(conversations, many= True)

  return JsonResponse(serializer.data, safe=False)
