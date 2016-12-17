from django.test import TestCase
from django.shortcuts import reverse
from django.contrib.auth import get_user_model
from django.contrib import auth
from rest_framework import status
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token


User = get_user_model()


class UsersEndpointTest(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.users_list_url = reverse('students-list')
        cls.user = User.objects.create_user('testuser', email='testuser@test.com', type=2, password='testing')

    def test_users_list_url(self):
        self.assertEqual(self.users_list_url, '/students/')
        
    def test_users_login(self):
        self.client.login(username='lauren', password='secret')
        user = auth.get_user(self.client)
        self.assertFalse(user.is_authenticated())
        self.client.login(username='testuser', password='testing')
        user = auth.get_user(self.client)
        self.assertTrue(user.is_authenticated())

    def test_create_student(self):
        self.client.login(username='testuser', password='testing')
        self.assertTrue(self.user.is_authenticated())
        post_data = {
            'username': 'testuser2',
            'full_name': 'Jan Kowalski',
            'password': 'pass',
            'type': 0,
        }
        response = self.client.post(self.users_list_url, post_data, format='json')
        print(response.content)
        self.client.logout()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(),2)
        created_user = User.objects.get(username="testuser2")
        self.assertTrue(created_user.is_student())
        self.assertTrue(created_user.check_password(post_data['password']))
        self.assertEqual(created_user.username, post_data['username'])
        self.assertEqual(created_user.full_name, post_data['full_name'])
        self.assertEqual(created_user.type, post_data['type'])
