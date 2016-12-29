from rest_framework import serializers

from courses.models import Course, ClassType, Group, TimeSlot
from users.models import User
from users.serializers import UserSerializer


class CourseSerializer(serializers.ModelSerializer):
    registered = serializers.SerializerMethodField()

    class Meta(object):
        model = Course
        fields = ('code', 'name', 'syllabus', 'tutor', 'registered', 'state')

    def create(self, validated_data):
        validated_data['tutor'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('code', None)  # code can't be updated
        return super().update(instance, validated_data)

    def get_registered(self, course):
        user = self.context['request'].user
        if not user.is_student():
            return None
        return user in course.registered_students.all()


class RegisteredStudentsSerializer(serializers.Serializer):
    students = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(type=User.Type.STUDENT),
        many=True
    )


class TimeSlotSerializer(serializers.ModelSerializer):
    enrolled = serializers.SerializerMethodField()

    class Meta(object):
        model = TimeSlot
        fields = ('id', 'day', 'time_start', 'time_end', 'enrolled')

    def get_enrolled(self, time_slot):
        user = self.context['request'].user
        if not user.is_student():
            return None
        return user in time_slot.enrolled_students.all()


class GroupSerializer(serializers.ModelSerializer):
    class_type = serializers.StringRelatedField()
    student_members = UserSerializer(many=True, read_only=True)
    is_registered = serializers.SerializerMethodField('get_registration_status')

    class Meta(object):
        model = Group
        fields = ('class_type', 'student_members', 'is_registered', 'name')

    def get_registration_status(self, obj):
        user = self.context['request'].user
        return user in obj.student_members.all()


class ClassTypeSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True, read_only=True)
    groups = GroupSerializer(many=True, read_only=True)

    class Meta(object):
        model = ClassType
        fields = ('id', 'name', 'time_slots', 'groups')
