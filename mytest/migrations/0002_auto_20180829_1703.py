# Generated by Django 2.1 on 2018-08-29 14:03

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mytest', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Icon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('path', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Marker',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(max_length=200)),
                ('point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('choice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mytest.Choice')),
            ],
        ),
        migrations.AddField(
            model_name='icon',
            name='marker',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mytest.Marker'),
        ),
    ]
