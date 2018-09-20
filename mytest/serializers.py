from mytest.models import *
from rest_framework import serializers
from django.contrib.gis.geos import GEOSGeometry
import datetime
from rest_framework_json_api.relations import ResourceRelatedField
import pdb


# сериализатор geojson в Wkt- формат координат


class QuestionSerializer(serializers.ModelSerializer):
    choices = serializers.SerializerMethodField()
    pub_date = serializers.SerializerMethodField()

    # choices=serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ('id', 'question_text', 'pub_date', 'choices')

    def get_pub_date(self, obj):
        format_date = obj.pub_date.strftime("%d.%m.%y %H:%M")
        # print(format_date)
        return format_date

    def get_choices(self, obj):
        return obj.choices.values()
        # for key, value in obj.choices.values():
        #     return dict(zip(key, value))


class ChoiceSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()

    class Meta:
        model = Choice
        fields = ('url', 'id', 'question', 'choice_text', 'votes')


class IconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Icon
        fields = ('url', 'id', 'title', 'path')


class MarkerSerializer(serializers.ModelSerializer):
    partial = True
    #icon = IconSerializer()

    class Meta:
        model = Marker
        fields = ('url', 'id', 'title', 'description', 'icon', 'point')


class MarkerGetSerializer(MarkerSerializer):
    icon= IconSerializer()











# def update(self, instance, validated_data):
#     fields= instance._meta.fields
#     exclude=[]
#     for field in fields:
#         field=field.name.split('.')[-1]
#         if field in exclude:
#             continue
#         exec ("instance.%s = validated_data.get(field, instance.%s)"%(field,field))
#
#     instance.save()
#
#     return instance

# # Delete any detail not included in the request
# owner_ids = [item['owner_id'] for item in validated_data['owners']]
# for owner in cars.owners.all():
#     if owner.id not in owner_ids:
#         owner.delete()
#
# # Create or update owner
# for owner in validated_data['owners']:
#     ownerObj = Owner.objects.get(pk=item['id'])
#     if ownerObje:
#         ownerObj.some_field = item['some_field']
#         ....fields...
#     else:
#         ownerObj = Owner.create(car=instance, **owner)
#     ownerObj.save()


# point.geoCoords=GEOSGeometry('SRID=4326; POINT(' + value + ')')
# def get_point_join_str(self, obj):
# choices/?quiestion=1
