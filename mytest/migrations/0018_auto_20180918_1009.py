# Generated by Django 2.1 on 2018-09-18 07:09

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('mytest', '0017_auto_20180917_0851'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='pub_date',
            field=models.DateTimeField(default=datetime.datetime(2018, 9, 18, 7, 9, 35, 584777, tzinfo=utc)),
        ),
    ]
