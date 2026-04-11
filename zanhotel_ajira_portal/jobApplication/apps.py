
from django.apps import AppConfig

class JobApplicationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'jobApplication'

    def ready(self):
        import jobApplication.signals  # connect signals
