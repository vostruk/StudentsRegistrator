from rest_framework import status
from rest_framework.exceptions import APIException


class RegistrationClosedError(APIException):
    default_detail = 'Rejestracja na ten przedmiot jest zamknięta'
    status_code = status.HTTP_400_BAD_REQUEST

class GroupRegistrationClosedError(APIException):
    default_detail = 'Prowadzący już zaakceptował grupy. Nie możesz nic zmienić'
    status_code = status.HTTP_400_BAD_REQUEST

class MaxNumberRegisteredError(APIException):
    default_detail = 'Maksymalna ilość zapisanych osób już została przekroczona'
    status_code = status.HTTP_400_BAD_REQUEST