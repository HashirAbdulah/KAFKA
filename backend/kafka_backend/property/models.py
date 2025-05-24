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
    state_province = models.CharField(max_length=255, default="Unknown")
    city = models.CharField(max_length=255, default="Unknown")
    street_address = models.CharField(max_length=255, default="Unknown")
    postal_code = models.CharField(max_length=20, default="00000")
    # Other fields
    category = models.CharField(max_length=200)
    primary_image = models.ImageField(
        upload_to="uploads/properties", null=True, blank=True
    )
    landlord = models.ForeignKey(
        User, related_name="properties", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    favourited = models.ManyToManyField(User, related_name="favourites", blank=True)

    def image_url(self):
        """Returns the URL of the primary image or the first available image."""
        if self.primary_image:
            return f"{settings.WEBSITE_URL}{self.primary_image.url}"

        # If no primary image, try to get the first image from the images list
        first_image = self.images.filter(is_primary=True).first()
        if first_image:
            return first_image.image_url()

        # If no images at all, return None
        return None

    def get_all_images(self):
        """Returns all images for the property, ordered by order and creation date."""
        return self.images.all().order_by("order", "created_at")

    def get_image_count(self):
        """Returns the total number of images for the property."""
        return self.images.count()

    def can_add_more_images(self):
        """Checks if more images can be added (max 5)."""
        return self.get_image_count() < 5

    def set_primary_image(self, image):
        """Sets the primary image for the property."""
        try:
            if isinstance(image, PropertyImage):
                # If a PropertyImage instance is provided
                self.primary_image = image.image
                image.is_primary = True
                image.save()
            else:
                # If a file is provided
                self.primary_image = image
                # Find the corresponding PropertyImage and set it as primary
                property_image = self.images.filter(image=image).first()
                if property_image:
                    property_image.is_primary = True
                    property_image.save()
            self.save()
        except Exception as e:
            print(f"Error setting primary image: {str(e)}")
            raise

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


class PropertyImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(
        Property, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="uploads/properties")
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def image_url(self):
        return f"{settings.WEBSITE_URL}{self.image.url}"

    def save(self, *args, **kwargs):
        # If this image is being set as primary, update other images
        if self.is_primary:
            PropertyImage.objects.filter(
                property=self.property, is_primary=True
            ).exclude(id=self.id).update(is_primary=False)

            # Update property's primary_image
            self.property.primary_image = self.image
            self.property.save()

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # If this is the primary image, update property's primary_image
        if self.is_primary:
            next_image = (
                PropertyImage.objects.filter(property=self.property)
                .exclude(id=self.id)
                .order_by("order", "created_at")
                .first()
            )

            if next_image:
                next_image.is_primary = True
                next_image.save()
                self.property.primary_image = next_image.image
            else:
                self.property.primary_image = None

            self.property.save()

        super().delete(*args, **kwargs)

    class Meta:
        ordering = ["order", "created_at"]
        indexes = [
            models.Index(fields=["property", "is_primary"]),
            models.Index(fields=["order"]),
        ]

    def __str__(self):
        return f"Image for {self.property.title}"


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
