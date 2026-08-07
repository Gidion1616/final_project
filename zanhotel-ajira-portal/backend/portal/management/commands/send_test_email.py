from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    """Command ya terminal inayothibitisha kama SMTP inaweza kutuma email halisi."""

    help = "Send a real test email using the configured email backend."

    def add_arguments(self, parser):
        parser.add_argument(
            "recipient", help="Email address that should receive the test"
        )

    def handle(self, *args, **options):
        if settings.EMAIL_BACKEND.endswith("console.EmailBackend"):
            raise CommandError(
                "Console email backend is active. Create backend/.env with SMTP settings first."
            )
        try:
            sent = send_mail(
                "ZanHotel email test",
                "Email delivery is configured correctly for ZanHotel Ajira Portal.",
                settings.DEFAULT_FROM_EMAIL,
                [options["recipient"]],
                fail_silently=False,
            )
        except Exception as exc:
            raise CommandError(f"Email delivery failed: {exc}") from exc
        if sent != 1:
            raise CommandError("The SMTP provider did not accept the message.")
        self.stdout.write(
            self.style.SUCCESS(
                f'Test email accepted for delivery to {options["recipient"]}.'
            )
        )
