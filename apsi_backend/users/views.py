from django.contrib.auth import get_user_model
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin

from users.serializers import UserSerializer


User = get_user_model()


class UserViewset(CreateModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
