from django.test import TestCase
from django.shortcuts import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from courses.factories import (
    ClassTypeFactory,
    CourseFactory,
    GroupFactory,
)
from courses.models import ClassType, Course, Group
from users.factories import UserFactory


User = get_user_model()


class CoursesEndpointTest(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.course_list_url = reverse('course-list')
        cls.tutor_user = User.objects.create_user('testuser', email='testuser@test.com', type=1, password='testing')

    def test_courses_list_url(self):
        self.assertEqual(self.course_list_url, '/courses/')
        
    def test_create_and_register_course(self):
        self.client.login(username='testuser', password='testing')
        self.assertTrue(self.tutor_user.is_authenticated())
        post_data = {
            'code': 'APSI',
            'name': 'Analiza i projektowanie systemow',
            'syllabus': 'Super scrum + classes waterfall',
            'state': 0,
        }
        response = self.client.post(self.course_list_url, post_data, format='json')
        #print(response.content)
        #self.client.logout()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Course.objects.count(), 1)
        created_course = Course.objects.get(code="APSI")
        self.assertEqual(created_course.code, post_data['code'])
        self.assertEqual(created_course.name, post_data['name'])
        self.assertEqual(created_course.state, post_data['state'])

        #create student
        post_data = {
            'username': 'student1',
            'full_name': 'Some Student',
            'password': 'pass',
            'type': 0,
        }
        response = self.client.post(reverse('students-list'), post_data, format='json')
        
        self.client.logout()
        self.client.login(username='student1', password='pass')
        register_data = {
            'code': 'APSI',
            'name': 'Analiza i projektowanie systemow',
            'syllabus': 'Super scrum + classes waterfall',
            'state': 0,
        }

        response = self.client.put(reverse('course-registration',kwargs={'pk':'APSI'}), post_data, format='json')
        #self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        #register student
        created_student = User.objects.get(username="student1")
        
        created_course.register_student(created_student)
        self.assertEqual(created_course.tutor, self.tutor_user)
        self.assertEqual(created_course.registered_students.count(), 1)


class GroupsViewTestCase(APITestCase):
    def setUp(self):
        self.user = UserFactory(type=User.Type.TUTOR)
        self.client.force_authenticate(self.user)
        self.student1 = UserFactory(type=User.Type.STUDENT)
        self.student2 = UserFactory(type=User.Type.STUDENT)
        self.student3 = UserFactory(type=User.Type.STUDENT)
        course = CourseFactory()
        class_type = ClassTypeFactory(course=course)
        self.group1 = GroupFactory(class_type=class_type)
        self.group2 = GroupFactory(class_type=class_type)

    def test_group_list(self):
        response = self.client.get(
            reverse(
                'group-list',
                kwargs={
                    'course_pk': self.group1.class_type.course.pk,
                    'class_type_pk': self.group1.class_type.pk,
                }
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_group_details(self):
        response = self.client.get(
            reverse(
                'group-detail',
                kwargs={
                    'course_pk': self.group1.class_type.course.pk,
                    'class_type_pk': self.group1.class_type.pk,
                    'pk': self.group1.pk,
                }
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_group_add(self):
        response = self.client.post(
            reverse(
                'group-list',
                kwargs={
                    'course_pk': self.group1.class_type.course.pk,
                    'class_type_pk': self.group1.class_type.pk,
                }
            ),
            data={
                'name': 'test'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_group = Group.objects.filter(name='test')
        self.assertTrue(new_group.exists())

    def test_register(self):
        self.client.force_authenticate(self.student1)
        response = self.client.put(
            reverse(
                'group-register',
                kwargs={
                    'course_pk': self.group1.class_type.course.pk,
                    'class_type_pk': self.group1.class_type.pk,
                    'pk': self.group1.pk,
                }
            ),
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        group1 = Group.objects.get(pk=self.group1.pk)
        self.assertIn(self.student1, group1.student_members.all())

    def test_close(self):
        response = self.client.put(
            reverse(
                'group-close',
                kwargs={
                    'course_pk': self.group1.class_type.course.pk,
                    'class_type_pk': self.group1.class_type.pk,
                }
            ),
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        class_type = ClassType.objects.get(pk=self.group1.class_type.pk)
        self.assertEqual(
            class_type.groups_state,
            ClassType.GroupsState.GROUPS_REGISTRATION_CLOSED
        )
