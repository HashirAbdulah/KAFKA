"""
ASGI config for kafka_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from channels.auth import AuthMiddlewareStack #noqa
from channels.routing import ProtocolTypeRouter, URLRouter #noqa
from channels.security.websocket import AllowedHostsOriginValidator #noqa
from django.core.asgi import get_asgi_application
from chat import routing
from chat.token_auth import TokenAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kafka_backend.settings')

application = get_asgi_application()



application = ProtocolTypeRouter({
  'http': get_asgi_application(),
  'websocket': TokenAuthMiddleware(
    URLRouter(
      routing.websocket_urlpatterns
    )
  )
})
