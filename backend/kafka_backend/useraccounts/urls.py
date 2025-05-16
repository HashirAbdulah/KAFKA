from django.urls import path
from dj_rest_auth.jwt_auth import get_refresh_view  # noqa
from dj_rest_auth.registration.views import RegisterView  # noqa
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView  # noqa
from rest_framework_simplejwt.views import TokenVerifyView  # noqa
from .views import CustomRegisterView
from . import api

urlpatterns = [
    path("register/", CustomRegisterView.as_view(), name="rest_register"),
    path("login/", LoginView.as_view(), name="rest_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    path("token/refresh/", get_refresh_view().as_view(), name="token_refresh"),
    path("landlord/<uuid:pk>/", api.landlord_detail, name="landlord_detail"),
    path("reservations/", api.reservations_list, name="reservations_list"),
    # New Profile Management URLs
    path("profile/", api.get_profile, name="get_profile"),
    path("profile/update/", api.update_profile, name="update_profile"),
    path("profile/change-password/", api.change_password, name="change_password"),
    path(
        "profile/privacy-settings/",
        api.update_privacy_settings,
        name="update_privacy_settings",
    ),
    path("profile/sessions/", api.get_active_sessions, name="get_active_sessions"),
    path("profile/sessions/logout/", api.logout_session, name="logout_session"),
    path("profile/verify-phone/", api.verify_phone, name="verify_phone"),
    path("profile/verify-identity/", api.verify_identity, name="verify_identity"),
]
