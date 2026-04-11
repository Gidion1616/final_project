from django.contrib import admin
from .models import JobSeeker
from .models import JobSeekerProfile
from .models import HotelUser

@admin.register(HotelUser)
class HotelUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'hotel_name')  # columns to show in admin list
    search_fields = ('user__email', 'hotel_name')  # enable search


# Badilisha site header (kile kinachoonekana juu)
admin.site.site_header = "ZanHotel – Ajira Portal"

# Badilisha site title (kile kinachoonekana kwenye browser tab)
admin.site.site_title = "ZanHotel – Ajira Portal"

# Badilisha welcome text (kinachoonekana kwenye index ya admin)
admin.site.index_title = "Karibu kwenye Mfumo wa Ajira wa ZanHotel"




admin.site.register(JobSeekerProfile)
admin.site.register(JobSeeker) 

