from django.urls import path, include

from . import views
from rest_framework import routers
from django.views.generic.base import TemplateView


# app_name = 'mytest'
router = routers.SimpleRouter()

router.register(r'question', views.QuestionViewSet, 'question')
router.register(r'choice', views.ChoiceViewSet, 'choice')
router.register(r'marker', views.MarkerViewSet, 'marker')
router.register(r'icon', views.IconViewSet, 'icon')


urlpatterns = router.urls

urlpatterns+=[path('', views.index, name='index'),
              path('auth/', include('djoser.urls')),
              path('auth/', include('djoser.urls.authtoken')),
              path('auth/', include('djoser.urls.jwt')),
              path('silk/', include('silk.urls', namespace='silk')),
              ]

