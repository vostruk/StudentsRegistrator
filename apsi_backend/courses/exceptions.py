from rest_framework import status
from rest_framework.exceptions import APIException


class RegistrationClosedError(APIException):
    default_detail = 'Rejestracja na ten przedmiot jest zamknięta'
    status_code = status.HTTP_400_BAD_REQUEST
