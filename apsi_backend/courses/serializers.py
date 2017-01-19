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
    enrolled_students = UserSerializer(many=True, read_only=True)

    class Meta(object):
        model = TimeSlot
        fields = ('id', 'day', 'time_start', 'time_end', 'enrolled', 'max_students_enrolled', 'enrolled_students')
    
    def validate(self, data):
        """
        Check that the Start time is less than finish time.
        """
        start = data['time_start']
        end = data['time_end']
        if start>=end:
            raise serializers.ValidationError('Finish time '+ str(end)+ ' cannot be less than start '+ str(start)+ ' time of the course')
        return data

    def get_enrolled(self, time_slot):
        user = self.context['request'].user
        if not user.is_student():
            return None
        return user in time_slot.enrolled_students.all()


class GroupSerializer(serializers.ModelSerializer):
    student_members = UserSerializer(many=True, read_only=True)
    is_registered = serializers.SerializerMethodField('get_registration_status')
    creator = UserSerializer(read_only=True)
    max_students_in_group = serializers.SerializerMethodField('get_max_students')

    class Meta(object):
        model = Group
        fields = (
            'id',
            'creator',
            'student_members',
            'is_registered',
            'name',
            'max_students_in_group'
        )
    
    def get_max_students(self, obj):
        return obj.class_type.max_students_in_group

    def get_registration_status(self, obj):
        user = self.context['request'].user
        return user in obj.student_members.all()

    def create(self, validated_data):
        members_data = validated_data.pop('student_members')
        creator = validated_data.pop('creator')
        group = Group.objects.create(**validated_data)
        group.creator = creator
        for student in members_data:
            group.student_members.add(student)
        group.save()
        return group


class ClassTypeSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True, read_only=True)
    groups = GroupSerializer(many=True, read_only=True)
    group_open = serializers.SerializerMethodField('get_group_status')
    time_slots_open = serializers.SerializerMethodField('get_time_slot_status')
    
    class Meta(object):
        model = ClassType
        fields = ('id', 'name', 'time_slots', 'groups', 'group_open', 'time_slots_open', 'max_students_in_group')

    def get_group_status(self, obj):
        if obj.groups_state == ClassType.GroupsState.GROUPS_REGISTRATION_OPEN:
            return True
        else:
            return False

    def get_time_slot_status(self, obj):
        if obj.time_slots_state == ClassType.TimeSlotsState.TIMESLOTS_REGISTRATION_OPEN:
            return True
        else:
            return False
