from django.shortcuts import render #noqa

# Create your views here.
from dj_rest_auth.registration.views import RegisterView
from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response

class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        try:
            # If name is not provided, extract it from the email
            if not request.data.get('name') and request.data.get('email'):
                request.data._mutable = True
                request.data['name'] = request.data['email'].split('@')[0]
                request.data._mutable = False

            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"email": ["This email is already registered."]},
                status=status.HTTP_400_BAD_REQUEST
            )
