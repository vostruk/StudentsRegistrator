from rest_framework import serializers

from courses.models import Course


class CourseSerializer(serializers.ModelSerializer):
    registered = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('code', 'name', 'syllabus', 'tutor', 'registered')
        read_only_fields = ('tutor',)

    def create(self, validated_data):
        validated_data['tutor'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        del validated_data['code']  # code can't be updated
        return super().update(instance, validated_data)

    def get_registered(self, course):
        user = self.context['request'].user
        if not user.is_student():
            return None
        return user in course.registered_students.all()
