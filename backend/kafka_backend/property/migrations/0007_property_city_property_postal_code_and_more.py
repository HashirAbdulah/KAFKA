# Generated by Django 5.1.7 on 2025-05-09 11:58

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0006_property_property_pr_landlor_340741_idx'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='city',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AddField(
            model_name='property',
            name='postal_code',
            field=models.CharField(default='00000', max_length=20),
        ),
        migrations.AddField(
            model_name='property',
            name='state_province',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AddField(
            model_name='property',
            name='street_address',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['state_province'], name='property_pr_state_p_d6b1ba_idx'),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['city'], name='property_pr_city_650e24_idx'),
        ),
    ]
