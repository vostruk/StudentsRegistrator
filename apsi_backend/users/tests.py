from django.test import TestCase
from django.shortcuts import reverse
from django.contrib.auth import get_user_model
from rest_framework import status


User = get_user_model()


class UsersEndpointTest(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.users_list_url = reverse('user-list')

    def test_users_list_url(self):
        self.assertEqual(self.users_list_url, '/users/')

    def test_create_student(self):
        post_data = {
            'username': 'testuser',
            'full_name': 'Jan Kowalski',
            'password': 'pass',
            'type': 0,
        }

        response = self.client.post(self.users_list_url, post_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        created_user = User.objects.first()
        self.assertTrue(created_user.is_student())
        self.assertTrue(created_user.check_password(post_data['password']))
        self.assertEqual(created_user.username, post_data['username'])
        self.assertEqual(created_user.first_name, post_data['first_name'])
        self.assertEqual(created_user.last_name, post_data['last_name'])
