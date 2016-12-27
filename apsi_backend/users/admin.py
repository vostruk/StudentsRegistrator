from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from users.models import User


class ApsiUserAdmin(UserAdmin):
    list_display = ('username', 'full_name', 'type')
    list_filter = ('type',)
    fields = ('username', 'full_name', 'type', 'password')
    fieldsets = None
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'full_name', 'type', 'password1', 'password2'),
        }),
    )


admin.site.register(User, ApsiUserAdmin)
admin.site.unregister(Group)
