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
                email = request.data.get('email')
                name = email.split('@')[0]

                # Instead of modifying request.data directly, create a modified copy
                # and override the get_serializer method to use our modified data
                self.modified_data = {**request.data}
                self.modified_data['name'] = name

            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"email": ["This email is already registered."]},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get_serializer(self, *args, **kwargs):
        # If we have modified data, use it for the serializer
        if hasattr(self, 'modified_data'):
            kwargs['data'] = self.modified_data
        return super().get_serializer(*args, **kwargs)

# Change the regiteration view
