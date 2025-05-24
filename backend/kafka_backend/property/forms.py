from django import forms
from django.core.exceptions import ValidationError
from .models import Property, PropertyImage


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

    def __init__(self, attrs=None):
        if attrs is None:
            attrs = {}
        attrs.update({'multiple': True})
        super().__init__(attrs)

    def value_from_datadict(self, data, files, name):
        if hasattr(files, "getlist"):
            return files.getlist(name)
        return files.get(name)


class MultipleFileField(forms.FileField):
    widget = MultipleFileInput

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result


class PropertyForm(forms.ModelForm):
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
            "primary_image",
        )

    def clean_primary_image(self):
        image = self.cleaned_data.get("primary_image")
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


class PropertyImageForm(forms.Form):
    images = MultipleFileField(
        required=True,
        widget=MultipleFileInput(
            attrs={"accept": "image/jpeg,image/png,image/jpg", "class": "file-input"}
        ),
    )

    def clean_images(self):
        images = self.cleaned_data.get("images", [])
        if not isinstance(images, list):
            images = [images]

        if len(images) > 5:
            raise ValidationError("You can upload a maximum of 5 images.")

        if len(images) < 1:
            raise ValidationError("You must upload at least 1 image.")

        for image in images:
            if not image.name.endswith(("jpg", "jpeg", "png")):
                raise ValidationError(
                    "Invalid file type. Please upload only PNG, JPG, or JPEG images."
                )

        return images
