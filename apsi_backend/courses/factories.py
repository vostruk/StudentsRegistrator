import factory

from users.factories import UserFactory
from users.models import User

from .models import (
    ClassType,
    Course,
    Group,
)


class CourseFactory(factory.DjangoModelFactory):
    code = factory.Sequence(str)
    name = factory.Sequence(str)
    syllabus = factory.Sequence(str)
    tutor = factory.SubFactory(UserFactory, type=User.Type.TUTOR)
    state = Course.State.REGISTRATION_OPENED

    class Meta(object):
        model = Course


class ClassTypeFactory(factory.DjangoModelFactory):
    course = factory.SubFactory(CourseFactory)

    class Meta(object):
        model = ClassType


class GroupFactory(factory.DjangoModelFactory):
    name = factory.Sequence(str)
    class_type = factory.SubFactory(ClassTypeFactory)

    class Meta(object):
        model = Group

    @factory.post_generation
    def student_members(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for student in extracted:
                self.student_members.add(student)