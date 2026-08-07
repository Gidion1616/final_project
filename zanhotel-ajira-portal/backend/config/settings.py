import os
from pathlib import Path

# Folda kuu inayotumika kwa database ya SQLite, uploads na faili la .env.
BASE_DIR = Path(__file__).resolve().parent.parent

# Soma siri za backend kutoka .env bila package nyingine. Thamani zilizowekwa
# kwenye operating system zina kipaumbele kuliko thamani za .env.
ENV_FILE = BASE_DIR / ".env"
if ENV_FILE.exists():
    for raw_line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))
# Mipangilio ya msingi ya usalama wa Django na application zilizosakinishwa.
SECRET_KEY = "change-this-in-production"
DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "portal",
]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]
ROOT_URLCONF = "config.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]
WSGI_APPLICATION = "config.wsgi.application"
# SQLite inafaa kwa development; production inapendekezwa kutumia PostgreSQL.
DATABASES = {
    "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}
}
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"}
]
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Dar_es_Salaam"
USE_I18N = True
USE_TZ = True
# Assets, uploads, User model maalumu na anwani za React zinazoruhusiwa.
STATIC_URL = "static/"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "portal.User"
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
]
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760

# EN: Home always treats jobs from the latest three days as recent.
# SW: Home hutambua ajira za siku tatu za mwisho pekee kuwa ajira mpya.
HOME_RECENT_JOBS_DAYS = 3
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# EN: SMS uses Twilio only when all credentials exist in .env.
# SW: SMS hutumia Twilio ikiwa credentials zote zimewekwa kwenye .env.
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", "")
# Mipangilio ya SMTP kutoka backend/.env; console hutumika kama SMTP haijawekwa.
DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL", os.getenv("EMAIL_HOST_USER", "noreply@zanhotel.go.tz")
)
EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend"
)
EMAIL_HOST = os.getenv("EMAIL_HOST", "localhost")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.getenv("msagaladaines@gmail.com", "")
EMAIL_HOST_PASSWORD = os.getenv("msagaladaines@gmail.com", "")
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_USE_SSL = os.getenv("EMAIL_USE_SSL", "False").lower() == "true"
EMAIL_TIMEOUT = int(os.getenv("EMAIL_TIMEOUT", "20"))
