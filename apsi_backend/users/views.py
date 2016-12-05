from django.contrib.auth import get_user_model
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin

from users.serializers import UserSerializer


User = get_user_model()


class StudentsViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(type=User.Type.STUDENT)


class TutorsViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(type=User.Type.TUTOR)
