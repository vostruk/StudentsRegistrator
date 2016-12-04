from django.contrib import admin
from django.contrib.auth.models import Group
from users.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'full_name', 'type')
    list_filter = ('type',)
    fields = ('username', 'full_name', 'type')


admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
