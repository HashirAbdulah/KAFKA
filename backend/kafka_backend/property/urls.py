from django.urls import path
from . import api

urlpatterns = [
    path('', api.properties_list, name='api_properties_list'),
    path('create/', api.create_property, name='api_create_property'),
    path('<uuid:pk>/', api.properties_detail, name='api_properties_detail'),
    path('<uuid:pk>/book/', api.book_property, name='api_book_property'),
    path('<uuid:pk>/update/', api.update_property, name='api_update_property'),
    path('<uuid:pk>/reservations/', api.property_reservation, name='api_property_reservation'),
    path('<uuid:pk>/toggle_favourite/', api.toggle_favourite, name='api_toggle_favourite'),
]

