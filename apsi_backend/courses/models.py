from django.db import models
from django.core.exceptions import ValidationError

from users.models import User


class Course(models.Model):
    class State:
        REGISTRATION_OPENED = 0
        STUDENTS_LIST_ACCEPTED = 1

    STATE_CHOICES = (
        (State.REGISTRATION_OPENED, 'Rejestracja otwarta'),
        (State.STUDENTS_LIST_ACCEPTED, 'Lista studentdów zaakceptowana'),
    )

    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    syllabus = models.TextField()
    tutor = models.ForeignKey(User, related_name='courses_taught')
    registered_students = models.ManyToManyField(User, related_name='courses_attended')
    state = models.IntegerField(choices=STATE_CHOICES, default=State.REGISTRATION_OPENED)

    def clean(self):
        if not self.tutor.is_tutor():
            raise ValidationError("Course tutor can't be student or admin")
        # if not all(student.is_student() for student in self.registered_students.all()):
        #     raise ValidationError("Only students can be registered to a course")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def register_student(self, some_student ):
        if some_student.is_student():
            self.registered_students.add(some_student)


class ClassType(models.Model):
    course = models.ForeignKey(Course)
    name = models.CharField(max_length=50)


class Group(models.Model):
    class_type = models.ForeignKey(ClassType)
    student_members = models.ManyToManyField(User)
    max_students_in_group = models.IntegerField()

class TimeSlot(models.Model):
    class Day:
        MONDAY = 0
        TUESDAY = 1
        WEDNESDAY = 2
        THURSDAY = 3
        FRIDAY = 4

    DAY_CHOICES = (
        (Day.MONDAY, 'Poniedziałek'),
        (Day.TUESDAY, 'Wtorek'),
        (Day.WEDNESDAY, 'Środa'),
        (Day.THURSDAY, 'Czwartek'),
        (Day.FRIDAY, 'Piątek'),
    )
    class_type = models.ForeignKey(ClassType, related_name='time_slots')
    enrolled_students = models.ManyToManyField(User)
    day = models.IntegerField(choices=DAY_CHOICES)
    time_start = models.TimeField()
    time_end = models.TimeField()
    max_students_enrolled = models.IntegerField()
