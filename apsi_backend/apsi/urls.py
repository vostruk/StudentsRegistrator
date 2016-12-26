"""apsi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter
from rest_framework.authtoken.views import obtain_auth_token

from users.views import StudentsViewSet, TutorsViewSet, me
from courses.views import CourseViewSet, ClassTypeViewSet, TimeSlotViewSet


router = DefaultRouter()
router.register(r'students', StudentsViewSet, base_name='students')
router.register(r'tutors', TutorsViewSet, base_name='tutors')
router.register(r'courses', CourseViewSet, base_name='course')

courses_router = NestedSimpleRouter(router, r'courses', lookup='course')
courses_router.register(r'class_types', ClassTypeViewSet, base_name='class-type')

class_type_router = NestedSimpleRouter(courses_router, r'class_types', lookup='class_type')
class_type_router.register(r'time_slots', TimeSlotViewSet, base_name='time-slot')


urlpatterns = [
    url(r'me/', me),
    url(r'^admin/', admin.site.urls),
    url(r'^login/', obtain_auth_token),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^docs/', include('rest_framework_docs.urls')),
]

urlpatterns += router.urls
urlpatterns += courses_router.urls
urlpatterns += class_type_router.urls