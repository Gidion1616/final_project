from django.contrib import admin
from .models import JobApplication



# Badilisha site header (kile kinachoonekana juu)
admin.site.site_header = "ZanHotel – Ajira Portal"

# Badilisha site title (kile kinachoonekana kwenye browser tab)
admin.site.site_title = "ZanHotel – Ajira Portal"

# Badilisha welcome text (kinachoonekana kwenye index ya admin)
admin.site.index_title = "Karibu kwenye Mfumo wa Ajira wa ZanHotel"



admin.site.register(JobApplication)



