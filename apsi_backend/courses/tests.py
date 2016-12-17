from django.test import TestCase
from django.shortcuts import reverse
from django.contrib.auth import get_user_model
from django.contrib import auth
from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from courses.models import Course


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
        self.assertEqual(Course.objects.count(),1)
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