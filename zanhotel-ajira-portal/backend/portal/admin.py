from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Hotel, Job, Application, ApiToken, SiteSetting

# UserAdmin huipa custom User fomu za kawaida za Django Admin.
admin.site.register(User, UserAdmin)
# Model zilizobaki zinasajiliwa ili Admin aweze kuziona na kuzisimamia.
admin.site.register([Hotel, Job, Application, ApiToken, SiteSetting])
