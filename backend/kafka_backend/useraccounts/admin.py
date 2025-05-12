# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import User


# @admin.register(User)
# class CustomUserAdmin(UserAdmin):
#     list_display = (
#         "name",
#         "email",
#         "is_staff",
#         "is_active",
#     )
#     list_filter = (
#         "is_staff",
#         "is_active",
#     )
#     search_fields = (
#         "name",
#         "email",
#     )
#     ordering = ("name",)
#     fieldsets = (
#         (None, {"fields": ("name", "email", "password")}),
#         (
#             "Permissions",
#             {
#                 "fields": (
#                     "is_active",
#                     "is_staff",
#                     "is_superuser",
#                     "groups",
#                     "user_permissions",
#                 )
#             },
#         ),
#         ("Important dates", {"fields": ("last_login", "date_joined")}),
#     )
#     add_fieldsets = (
#         (
#             None,
#             {
#                 "classes": ("wide",),
#                 "fields": (
#                     "name",
#                     "email",
#                     "password1",
#                     "password2",
#                     "is_staff",
#                     "is_active",
#                 ),
#             },
#         ),
#     )
# useraccounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "name",
        "email",
        "is_staff",
        "is_active",
        "date_joined",  # This is fine in list_display
    )
    list_filter = (
        "is_staff",
        "is_active",
    )
    search_fields = (
        "name",
        "email",
    )
    ordering = ("name",)
    fieldsets = (
        (None, {"fields": ("name", "email", "password")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login",)}),  # Remove date_joined from here
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "name",
                    "email",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )
    readonly_fields = ("last_login",)  # Add this to make last_login read-only
