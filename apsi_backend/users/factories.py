import factory

from django.contrib.auth import get_user_model


class UserFactory(factory.DjangoModelFactory):
    class Meta(object):
        model = get_user_model()

    username = factory.Faker('first_name')
    password = 'test'
    type = get_user_model().Type.ADMIN

    @classmethod
    def _create(cls, model_class, **kwargs):
        return model_class.objects.create_user(**kwargs)
