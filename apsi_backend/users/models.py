from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager


class ApsiUserManager(UserManager):
    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields['type'] = User.Type.ADMIN
        return super().create_superuser(username, email, password, **extra_fields)


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
    full_name = models.CharField(max_length=60)

    objects = ApsiUserManager()

    def is_student(self):
        return self.type == User.Type.STUDENT

    def is_tutor(self):
        return self.type == User.Type.TUTOR

    def is_admin(self):
        return self.type == User.Type.ADMIN

    def save(self, *args, **kwargs):
        self.is_superuser = self.is_admin()
        super().save(*args, **kwargs)
