from django.contrib import admin
from .models import Hotel


# Badilisha site header (kile kinachoonekana juu)
admin.site.site_header = "ZanHotel – Ajira Portal"

# Badilisha site title (kile kinachoonekana kwenye browser tab)
admin.site.site_title = "ZanHotel – Ajira Portal"

# Badilisha welcome text (kinachoonekana kwenye index ya admin)
admin.site.index_title = "Karibu kwenye Mfumo wa Ajira wa ZanHotel"


class HotelAdmin(admin.ModelAdmin):
    list_display = ['id', 'hotel_name', 'get_email', 'get_is_active']

    def get_email(self, obj):
        return obj.user.email
    get_email.admin_order_field = 'user__email'  # enables sorting
    get_email.short_description = 'Email'

    def get_is_active(self, obj):
        return obj.user.is_active
    get_is_active.admin_order_field = 'user__is_active'
    get_is_active.boolean = True  # shows tick/cross in admin
    get_is_active.short_description = 'Active'

admin.site.register(Hotel, HotelAdmin)
