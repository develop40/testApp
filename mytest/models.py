from django.db import models
from django.utils import timezone
import datetime
from django.contrib.gis.db import models


# Create your models here.


class Question(models.Model):
    question_text = models.CharField(null=True, max_length=200)
    pub_date = models.DateTimeField(default=timezone.now())
    #choices= models.ForeignKey(Choice, on_delete=models.CASCADE)

    def __str__(self):
        return self.question_text

    def was_published_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.pub_date <= now


class Choice(models.Model):

    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text


class Icon(models.Model):
    title = models.CharField(max_length=100)
    path = models.CharField(max_length=200)


class Marker(models.Model):
    #choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=200)
    point = models.PointField(null=True)
    icon= models.ForeignKey(Icon, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


