# Generated by Django 5.1.7 on 2025-04-23 18:01

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0005_reservation_property_re_propert_90ca18_idx_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['landlord_id'], name='property_pr_landlor_340741_idx'),
        ),
    ]
