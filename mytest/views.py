from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404, render
from rest_framework.parsers import JSONParser
from mytest.serializers import *
from rest_framework import viewsets
from rest_framework.response import Response
from mytest.models import *
from rest_framework.permissions import AllowAny
from django.template import loader
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import filters
import pdb


def index(request):
    template = loader.get_template('mytest/index.html')
    return HttpResponse(template.render())


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['$question_text']


class ChoiceViewSet(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [AllowAny]
    filter_backends = (filters.SearchFilter,)
    search_fields = ["$choice_text"]


class MarkerViewSet(viewsets.ModelViewSet):
    queryset = Marker.objects.all()
    serializer_class = MarkerSerializer
    permission_classes = [AllowAny]
    filter_backends = (filters.SearchFilter,)
    search_fields = ["$title", "$description"]

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer_context = {'request': request}
        serializer = MarkerGetSerializer(queryset, many=True, context=serializer_context)
        # pdb.set_trace()
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = self.filter_queryset(self.get_queryset())
        serializer_context = {'request': request}
        marker = get_object_or_404(queryset, pk=pk)
        serializer = MarkerGetSerializer(marker, context=serializer_context)
        return Response(serializer.data)

    # def partial_update(self, request, pk=None):
    #
    #     icon_key = request.data.get('icon')
    #     get_icon = Icon.objects.get(pk=icon_key)
    #     request.data['icon'] = get_icon
    #
    #     serializer_context = {'request': request}
    #     serializer = MarkerGetSerializer(partial=True, data=request.data, context=serializer_context)
    #    # pdb.set_trace()
    #     serializer.is_valid()
    #     serializer.save()
    #
    #     return Response(serializer.data)

    # def partial_update(self, request, pk=None):
    #
    #     serializer_context = {'request': request}
    #     serializer = MarkerSerializer(partial=True, data=request.data)
    #
    #     serializer.is_valid()
    #     serializer.save()
    #
    #     icon_key = request.data.get('icon')
    #     get_icon = Icon.objects.get(pk=icon_key)
    #     request.data['icon'] = get_icon
    #
    #     _serializer= MarkerGetSerializer(partial=True, data=request.data, context=serializer_context)
    #     _serializer.is_valid()
    #     #pdb.set_trace()
    #
    #     return Response(_serializer.data)



class IconViewSet(viewsets.ModelViewSet):
    queryset = Icon.objects.all()
    serializer_class = IconSerializer
    permission_classes = [AllowAny]
