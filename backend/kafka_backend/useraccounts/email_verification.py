import random
import string
import logging
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import User, EmailVerification

logger = logging.getLogger(__name__)


def generate_verification_code():
    """Generate a 6-digit verification code"""
    return "".join(random.choices(string.digits, k=6))


def get_email_template(context, template_name):
    """Render email template with context"""
    try:
        html_message = render_to_string(f"emails/{template_name}.html", context)
        plain_message = strip_tags(html_message)
        return html_message, plain_message
    except Exception as e:
        logger.error(f"Error rendering email template {template_name}: {str(e)}")
        # Fallback to simple text message if template rendering fails
        return None, context.get("message", "")


def send_verification_email(user_email, code, template_name="verification_code"):
    """Send verification email using configured email backend"""
    subject = "Verify your email address"
    context = {
        "code": code,
        "email": user_email,
        "message": f"""
        Thank you for signing up! Please use the following code to verify your email address:

        {code}

        This code will expire in 15 minutes.

        If you didn't request this verification, please ignore this email.
        """,
    }

    try:
        html_message, plain_message = get_email_template(context, template_name)

        # Log attempt to send email
        logger.info(f"Attempting to send verification email to {user_email}")

        # Send email using Django's send_mail
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )

        # Log successful email delivery
        logger.info(f"Verification email sent successfully to {user_email}")
        return True, None

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error sending verification email to {user_email}: {error_msg}")

        # Provide user-friendly error messages based on the error
        if "Authentication Required" in error_msg:
            return False, "Email service authentication failed. Please contact support."
        elif "Invalid credentials" in error_msg:
            return (
                False,
                "Email service credentials are invalid. Please contact support.",
            )
        elif "Connection refused" in error_msg:
            return False, "Unable to connect to email service. Please try again later."
        else:
            return False, "Failed to send verification email. Please try again later."


@api_view(["POST"])
@permission_classes([AllowAny])
def send_verification_code(request):
    """Send a new verification code to the user's email"""
    email = request.data.get("email")
    if not email:
        return Response(
            {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
        # Invalidate any existing unused codes
        EmailVerification.objects.filter(user=user, is_used=False).update(is_used=True)

        # Generate and save new code
        code = generate_verification_code()
        verification = EmailVerification.objects.create(user=user, code=code)

        # Send email
        success, error_message = send_verification_email(user.email, code)
        if success:
            return Response(
                {"message": "Verification code sent successfully"},
                status=status.HTTP_200_OK,
            )
        else:
            # Delete the verification code if email sending failed
            verification.delete()
            return Response(
                {"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Unexpected error in send_verification_code: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_email(request):
    """Verify the user's email using the provided code"""
    email = request.data.get("email")
    code = request.data.get("code")

    if not email or not code:
        return Response(
            {"error": "Email and verification code are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(email=email)
        verification = EmailVerification.objects.filter(
            user=user, code=code, is_used=False
        ).latest("created_at")

        if not verification.is_valid():
            return Response(
                {"error": "Invalid or expired verification code"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Mark code as used and verify user's email
        verification.is_used = True
        verification.save()
        user.is_email_verified = True
        user.save()

        # Generate tokens for immediate login
        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Email verified successfully",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "pk": str(user.pk),
                    "email": user.email,
                    "name": user.name,
                    "is_email_verified": user.is_email_verified,
                },
            },
            status=status.HTTP_200_OK,
        )

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except EmailVerification.DoesNotExist:
        return Response(
            {"error": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Unexpected error in verify_email: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password_send_code(request):
    email = request.data.get("email")
    if not email:
        return Response(
            {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        user = User.objects.get(email=email)
        if not user.is_email_verified:
            return Response(
                {"error": "Email is not verified."}, status=status.HTTP_400_BAD_REQUEST
            )
        # Invalidate any existing unused codes
        EmailVerification.objects.filter(user=user, is_used=False).update(is_used=True)
        code = generate_verification_code()
        verification = EmailVerification.objects.create(user=user, code=code)

        # Send email using password reset template
        success, error_message = send_verification_email(
            user.email,
            code,
            template_name='password_reset'
        )

        if success:
            logger.info(f"Password reset code sent successfully to {user.email}")
            return Response(
                {"message": "Password reset code sent successfully"},
                status=status.HTTP_200_OK,
            )
        else:
            logger.error(f"Failed to send password reset code to {user.email}: {error_message}")
            verification.delete()
            return Response(
                {"error": error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    except User.DoesNotExist:
        logger.warning(f"Password reset attempt for non-existent email: {email}")
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Unexpected error in forgot_password_send_code: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password_verify_code(request):
    email = request.data.get("email")
    code = request.data.get("code")
    if not email or not code:
        return Response(
            {"error": "Email and code are required"}, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        user = User.objects.get(email=email)
        verification = EmailVerification.objects.filter(
            user=user, code=code, is_used=False
        ).latest("created_at")
        if not verification.is_valid():
            return Response(
                {"error": "Invalid or expired verification code"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        verification.is_used = True
        verification.save()
        return Response(
            {"message": "Code verified. You may now reset your password."},
            status=status.HTTP_200_OK,
        )
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except EmailVerification.DoesNotExist:
        return Response(
            {"error": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password_reset(request):
    email = request.data.get("email")
    code = request.data.get("code")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")
    if not email or not code or not new_password or not confirm_password:
        return Response(
            {"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST
        )
    if new_password != confirm_password:
        return Response(
            {"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST
        )
    if len(new_password) < 8:
        return Response(
            {"error": "Password must be at least 8 characters."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = User.objects.get(email=email)
        verification = EmailVerification.objects.filter(
            user=user, code=code, is_used=True
        ).latest("created_at")
        # Only allow reset if code was just verified
        if not verification:
            return Response(
                {"error": "Verification required."}, status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(new_password)
        user.save()
        return Response(
            {"message": "Password reset successful. You may now log in."},
            status=status.HTTP_200_OK,
        )
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except EmailVerification.DoesNotExist:
        return Response(
            {"error": "Invalid or expired verification code"},
            status=status.HTTP_400_BAD_REQUEST,
        )
