from django.contrib import admin
from .models import Property, Reservation #noqa

# Register your models here.
admin.site.register(Property)
admin.site.register(Reservation)
