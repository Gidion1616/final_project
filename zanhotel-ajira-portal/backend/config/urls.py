from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Hufungua njia za Django Admin, API ya portal na media wakati wa development.
urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("api/", include("portal.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
