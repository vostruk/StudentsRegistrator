from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Type:
        STUDENT = 0
        TUTOR = 1
        ADMIN = 2

    USER_TYPES = (
        (Type.STUDENT, "student"),
        (Type.TUTOR, "tutor"),
        (Type.ADMIN, "admin"),
    )

    type = models.IntegerField(choices=USER_TYPES)

    def is_student(self):
        return self.type == User.Type.STUDENT
