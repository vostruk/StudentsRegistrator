from django.db import models
from django.core.exceptions import ValidationError

from users.models import User


class Course(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    syllabus = models.TextField()
    tutor = models.ForeignKey(User)

    def clean(self):
        if not self.tutor.is_tutor():
            raise ValidationError("Course tutor can't be student or admin")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
