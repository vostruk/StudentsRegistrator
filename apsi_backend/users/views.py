from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin

from users.serializers import UserSerializer


User = get_user_model()


@api_view(['GET'])
def me(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


class StudentsViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(type=User.Type.STUDENT)


class TutorsViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(type=User.Type.TUTOR)
