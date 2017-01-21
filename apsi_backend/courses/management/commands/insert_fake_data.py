import re
import random
from datetime import time, timedelta
from itertools import product, islice, count
from django.core.management.base import BaseCommand
from django.db import transaction
from users.models import User
from courses.models import Course, ClassType, Group, TimeSlot
from faker import Factory


fake = Factory.create('pl_PL')
courses_names = (
    'Analiza',
    'Algebra',
    'Bazy Danych',
    'Programowanie',
    'Systemy Operacyjne',
    'Architektura Komputerów',
    'Inżynieria Oprogramowania',
)
class_types = (
    'Laboratoria',
    'Ćwiczenia',
    'Projekt',
)


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('students_number', type=int)
        parser.add_argument('tutors_number', type=int)
        parser.add_argument('courses_number', type=int)

    @transaction.atomic
    def handle(self, students_number, tutors_number, courses_number, **options):
        for i in map(str, range(students_number)):
            username = 'student' + i
            name = fake.name() + ' (' + username + ')'
            if name.startswith('pani '):
                name = name[5:]
            if name.startswith('pan '):
                name = name[4:]
            User.objects.create_user(username, '', 'pass', full_name=name, type=User.Type.STUDENT)

        for i in map(str, range(tutors_number)):
            username = 'tutor' + i
            name = fake.name() + ' (' + username + ')'
            if name.startswith('pani '):
                name = name[5:]
            if name.startswith('pan '):
                name = name[4:]
            User.objects.create_user(username, '', 'pass', full_name=name, type=User.Type.TUTOR)

        for number, courses_name in islice(product(map(str, range(1, courses_number + 1)), courses_names), courses_number):
            course = Course.objects.create(
                code=courses_name[:3].upper() + number, name=courses_name + ' ' + number,
                syllabus=fake.text(), tutor=User.objects.filter(type=User.Type.TUTOR).order_by('?').first()
            )
            students = list(User.objects.filter(type=User.Type.STUDENT).order_by('?')[:random.randint(0, 30)])
            course.registered_students.add(*students)

            for class_type in random.sample(class_types, random.randint(1, 3)):
                max_students_in_group = random.randint(0, 5)
                class_type = ClassType.objects.create(name=class_type, course=course, max_students_in_group=max_students_in_group)

                students_iter = iter(students[:-6])
                group_num = 1
                while max_students_in_group:
                    members = list(islice(students_iter, random.randint(1, max_students_in_group)))
                    if not members: break
                    group = Group.objects.create(name='Grupa ' + str(group_num), creator=members[0], class_type=class_type)
                    group.student_members.add(*members[1:])
                    group_num += 1

                students_iter = iter(students[:-6])
                while max_students_in_group:
                    max_students_in_slot = random.randint(1, 15)
                    members = list(islice(students_iter, random.randint(1, max_students_in_slot)))
                    if not members: break
                    hour = random.randint(8, 16)
                    time_start = time(hour=hour)
                    time_end = time(hour=hour + 1)
                    time_slot = TimeSlot.objects.create(
                        class_type=class_type, day=random.randint(0, 4), max_students_enrolled=max_students_in_slot,
                        time_start=time_start, time_end=time_end
                    )

                    time_slot.enrolled_students.add(*members[1:])
