from django.shortcuts import render #noqa

# Create your views here.
from dj_rest_auth.registration.views import RegisterView
from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response

class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"email": ["This email is already registered."]},
                status=status.HTTP_400_BAD_REQUEST
            )
