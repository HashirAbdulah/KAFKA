from django.forms import ModelForm  # noqa
from django.core.exceptions import ValidationError  # noqa
from .models import Property  # noqa


class PropertyForm(ModelForm):
    class Meta:
        model = Property
        fields = (
            "title",
            "description",
            "price_per_night",
            "guests",
            "bedrooms",
            "bathrooms",
            "country",
            "country_code",
            "state_province",
            "city",
            "street_address",
            "postal_code",
            "category",
            "image",
        )

    def clean_image(self):
        image = self.cleaned_data.get("image")

        # Validate the image file extension (check if it's PNG, JPG, or JPEG)
        if image:
            if not image.name.endswith(("jpg", "jpeg", "png")):
                raise ValidationError(
                    "Invalid file type. Please upload a PNG, JPG, or JPEG image."
                )
        return image

    def clean_price_per_night(self):
        return int(self.cleaned_data["price_per_night"])

    def clean_guests(self):
        return int(self.cleaned_data["guests"])

    def clean_bedrooms(self):
        return int(self.cleaned_data["bedrooms"])

    def clean_bathrooms(self):
        return int(self.cleaned_data["bathrooms"])
