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

    def get_queryset(self):
        registered = self.request.query_params.get('registered', None)
        if registered is not None:
            return self.request.user.courses_attended
        tutored = self.request.query_params.get('tutored', None)
        if tutored is not None:
            return self.request.user.courses_taught
        return Course.objects.prefetch_related('registered_students').all()

    @detail_route(['PUT', 'DELETE'], permission_classes=[StudentsOnlyPermissions])
    def registration(self, request, pk):
        course = self.get_object()
        user = request.user
        if user.is_student() and course.state != Course.State.REGISTRATION_OPENED:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={'detail': 'Course must have an open registration'}
            )
        if request.method == 'PUT':
            course.registered_students.add(user)
        if request.method == 'DELETE':
            course.registered_students.remove(user)
        return Response(status=status.HTTP_204_NO_CONTENT)
