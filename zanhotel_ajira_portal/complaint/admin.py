from django.contrib import admin
from .models import Complaint




@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "subject", "created_at")
    list_filter = ("created_at",)
    search_fields = ("full_name", "email", "subject")
# Badilisha site header (kile kinachoonekana juu)
admin.site.site_header = "ZanHotel – Ajira Portal"

# Badilisha site title (kile kinachoonekana kwenye browser tab)
admin.site.site_title = "ZanHotel – Ajira Portal"

# Badilisha welcome text (kinachoonekana kwenye index ya admin)
admin.site.index_title = "Karibu kwenye Mfumo wa Ajira wa ZanHotel"
