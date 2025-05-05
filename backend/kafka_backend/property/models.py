from django.db import models
import uuid
from django.conf import settings
from useraccounts.models import User


class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price_per_night = models.IntegerField()
    guests = models.IntegerField()
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    # Address fields
    country = models.CharField(max_length=255)
    country_code = models.CharField(max_length=7)
    state_province = models.CharField(max_length=255,default="Unknown")
    city = models.CharField(max_length=255,default="Unknown")
    street_address = models.CharField(max_length=255, default="Unknown")
    postal_code = models.CharField(max_length=20,default="00000")
    # Other fields
    category = models.CharField(max_length=200)
    image = models.ImageField(upload_to="uploads/properties")
    landlord = models.ForeignKey(
        User, related_name="properties", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    favourited = models.ManyToManyField(User, related_name="favourites", blank=True)

    def image_url(self):
        return f"{settings.WEBSITE_URL}{self.image.url}"

    def __str__(self):
        return f"{self.title} - {self.category}"

    class Meta:
        indexes = [
            models.Index(fields=["country"]),
            models.Index(fields=["state_province"]),
            models.Index(fields=["city"]),
            models.Index(fields=["category"]),
            models.Index(fields=["price_per_night"]),
            models.Index(fields=["guests"]),
            models.Index(fields=["bedrooms"]),
            models.Index(fields=["bathrooms"]),
            models.Index(fields=["landlord_id"]),
        ]


class Reservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(
        Property, related_name="reservations", on_delete=models.CASCADE
    )
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_nights = models.IntegerField()
    guests = models.IntegerField()
    total_price = models.FloatField()
    created_by = models.ForeignKey(
        User, related_name="created_reservations", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reservation for {self.property.title} by {self.created_by}"

    class Meta:
        indexes = [
            models.Index(fields=["property", "start_date", "end_date"]),
            models.Index(fields=["created_by"]),
        ]
