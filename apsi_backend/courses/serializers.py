from rest_framework import serializers

from courses.models import Course, ClassType, Group, TimeSlot
from users.models import User


class CourseSerializer(serializers.ModelSerializer):
    registered = serializers.SerializerMethodField()

    class Meta:
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
    students = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(type=User.Type.STUDENT), many=True)


class TimeSlotSerializer(serializers.ModelSerializer):
    enrolled = serializers.SerializerMethodField()

    class Meta:
        model = TimeSlot
        fields = ('id', 'day', 'time_start', 'time_end', 'enrolled', 'max_students_enrolled')

    def get_enrolled(self, time_slot):
        user = self.context['request'].user
        if not user.is_student():
            return None
        return user in time_slot.enrolled_students.all()


class ClassTypeSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = ClassType
        fields = ('id', 'name', 'time_slots')
