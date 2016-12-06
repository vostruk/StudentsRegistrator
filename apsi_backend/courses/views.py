from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.decorators import detail_route

from courses.serializers import CourseSerializer
from courses.models import Course


class CoursesPermissions(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_tutor()

    def has_object_permission(self, request, view, obj):
        if request.method not in SAFE_METHODS + ('post',):
            return obj.tutor == request.user
        return True


class StudentsOnlyPermissions(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return request.user.is_student()


class CourseViewSet(ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.prefetch_related('registered_students').all()
    permission_classes = (CoursesPermissions,)

    @detail_route(['PUT', 'DELETE'], permission_classes=[StudentsOnlyPermissions])
    def registration(self, request, pk):
        course = self.get_object()
        user = request.user
        if request.method == 'PUT':
            course.registered_students.add(user)
        if request.method == 'DELETE':
            course.registered_students.remove(user)
        return Response(status=status.HTTP_204_NO_CONTENT)
