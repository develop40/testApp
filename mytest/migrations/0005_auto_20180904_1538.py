# Generated by Django 2.1 on 2018-09-04 12:38

import datetime
import django.contrib.gis.db.models.fields
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('mytest', '0004_auto_20180904_1524'),
    ]

    operations = [
        migrations.AlterField(
            model_name='marker',
            name='point',
            field=django.contrib.gis.db.models.fields.PointField(null=True, srid=4326),
        ),
        migrations.AlterField(
            model_name='question',
            name='pub_date',
            field=models.DateTimeField(default=datetime.datetime(2018, 9, 4, 12, 38, 32, 218076, tzinfo=utc)),
        ),
    ]
