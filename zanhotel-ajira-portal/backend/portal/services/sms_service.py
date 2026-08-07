"""
SMS SERVICE / HUDUMA YA SMS
EN: Real SMS needs a telecom gateway; this implementation supports Twilio REST.
SW: SMS halisi inahitaji gateway ya simu; implementation hii hutumia Twilio REST.
EN: Credentials stay in .env and are never saved in source or the database.
SW: Credentials hubaki .env na hazihifadhiwi ndani ya source au database.
EN: A missing configuration returns a clear result instead of breaking an API action.
SW: Configuration ikikosekana, API haiharibiki na sababu hurudishwa wazi.
"""

import base64
import logging
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings

logger = logging.getLogger(__name__)


def send_sms(phone, message):
    if not phone:
        return {"sent": False, "error": "Recipient has no phone number."}
    if not all(
        [
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN,
            settings.TWILIO_FROM_NUMBER,
        ]
    ):
        return {"sent": False, "error": "SMS gateway is not configured."}
    endpoint = f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
    payload = urlencode(
        {"To": phone, "From": settings.TWILIO_FROM_NUMBER, "Body": message}
    ).encode()
    credentials = base64.b64encode(
        f"{settings.TWILIO_ACCOUNT_SID}:{settings.TWILIO_AUTH_TOKEN}".encode()
    ).decode()
    request = Request(
        endpoint, data=payload, headers={"Authorization": f"Basic {credentials}"}
    )
    try:
        with urlopen(request, timeout=20) as response:
            return {"sent": response.status in (200, 201), "error": ""}
    except Exception as exc:
        logger.exception("SMS delivery failed for %s", phone)
        return {"sent": False, "error": str(exc)}
