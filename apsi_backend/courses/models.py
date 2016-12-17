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