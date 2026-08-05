from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User,Hotel,Job,Application,ApiToken,SiteSetting
admin.site.register(User,UserAdmin);admin.site.register([Hotel,Job,Application,ApiToken,SiteSetting])
