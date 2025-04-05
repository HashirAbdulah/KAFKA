from django.urls import path
from dj_rest_auth.jwt_auth import get_refresh_view #noqa
from dj_rest_auth.registration.views import RegisterView # noqa
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView  # noqa
from rest_framework_simplejwt.views import TokenVerifyView  # noqa
from .views import CustomRegisterView
# from . import api  # noqa

urlpatterns = [
    path("register/", CustomRegisterView.as_view(), name="rest_register"),
    path("login/", LoginView.as_view(), name="rest_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    # path("<uuid:pk>/", api.landlord_detail, name="api_landlord_detail"),
]
