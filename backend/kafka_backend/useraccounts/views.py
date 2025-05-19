from dj_rest_auth.registration.views import RegisterView
from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from .email_verification import send_verification_email, generate_verification_code
from .models import EmailVerification, User


class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        try:
            if not request.data.get("name"):
                return Response(
                    {"name": ["Name is required."]}, status=status.HTTP_400_BAD_REQUEST
                )

            # Create user but don't activate yet
            response = super().create(request, *args, **kwargs)

            if response.status_code == status.HTTP_201_CREATED and isinstance(response.data, dict):
                # Get the newly created user from the response data
                user_data = response.data.get('user', {})
                if not isinstance(user_data, dict):
                    return Response(
                        {"error": "Invalid user data in response."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                user_id = user_data.get('pk')
                if not user_id:
                    return Response(
                        {"error": "Failed to create user account."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                try:
                    user = User.objects.get(pk=user_id)
                except User.DoesNotExist:
                    return Response(
                        {"error": "Failed to create user account."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                # Generate and save verification code
                code = generate_verification_code()
                EmailVerification.objects.create(
                    user=user,
                    code=code
                )

                # Send verification email
                if send_verification_email(user.email, code):
                    # Create a new response with verification required message
                    return Response({
                        "message": "Registration successful. Please check your email for verification code.",
                        "requires_verification": True,
                        "user": user_data
                    }, status=status.HTTP_201_CREATED)
                else:
                    # If email sending fails, delete the user and return error
                    user.delete()
                    return Response(
                        {"error": "Failed to send verification email. Please try again."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            return response

        except IntegrityError:
            return Response(
                {"email": ["This email is already registered."]},
                status=status.HTTP_400_BAD_REQUEST,
            )


# Change the regiteration view
