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

def index(request):
    template = loader.get_template('mytest/index.html')
    return HttpResponse(template.render())


class QuestionViewSet(viewsets.ModelViewSet):

    #queryset = Choice.objects.all()
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ['$question_text']


    # permission_classes = [AllowAny]

    # def list(self, request):
    #     queryset = Question.objects.all()
    #     serializer_context = {'request': request}
    #     serializer = QuestionSerializer(queryset, many=True, context=serializer_context)
    #     return Response(serializer.data)

    # def retrieve(self, request, pk=None):
    #     queryset = Question.objects.all()
    #     serializer_context={'request': request}
    #     question= get_object_or_404(queryset, pk=pk)
    #     serializer=QuestionSerializer(question, context=serializer_context)
    #     return Response(serializer.data)


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


class IconViewSet(viewsets.ModelViewSet):
    queryset = Icon.objects.all()
    serializer_class = IconSerializer
    permission_classes = [AllowAny]
