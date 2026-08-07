"""
EMAIL SERVICE / HUDUMA YA BARUA PEPE
EN: This module keeps all email construction and delivery outside API views.
SW: Module hii huweka utengenezaji na utumaji wa email nje ya API views.
EN: Every recipient receives a separate message, so addresses remain private.
SW: Kila mpokeaji hupata ujumbe wake ili anuani za wengine zibaki siri.
EN: HTML and plain-text alternatives improve compatibility and accessibility.
SW: HTML na plain text hufanya ujumbe usomeke kwenye vifaa tofauti.
EN: Delivery errors are logged and returned without rolling back saved data.
SW: Hitilafu hurekodiwa bila kufuta taarifa ambazo tayari zimehifadhiwa.
"""

import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from django.template.loader import render_to_string
from .sms_service import send_sms

logger = logging.getLogger(__name__)


def send_portal_email(subject, message, recipients, heading=None, action=None):
    """EN: Send branded private emails. SW: Tuma email binafsi zenye chapa ya portal."""
    valid_recipients = []
    for recipient in set(recipients):
        try:
            validate_email(recipient)
            valid_recipients.append(recipient)
        except Exception:
            logger.warning("Invalid email address skipped: %s", recipient)

    sent = 0
    errors = []
    for recipient in valid_recipients:
        context = {
            "heading": heading or subject,
            "message": message,
            "action": action,
            "portal_name": "ZANHOTEL AJIRA PORTAL",
        }
        html = render_to_string("emails/notification.html", context)
        email = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient],
        )
        email.attach_alternative(html, "text/html")
        try:
            sent += email.send(fail_silently=False)
        except Exception as exc:
            logger.exception("Email delivery failed for %s", recipient)
            errors.append(f"{recipient}: {exc}")
    return {"sent": sent, "errors": errors}


def send_registration_email(user):
    result = send_portal_email(
        "Welcome to ZanHotel Ajira Portal",
        f"Hello {user.get_full_name() or user.username},\n\nYour Job Seeker account was created successfully. You can now sign in, browse verified hotel vacancies and track every application.",
        [user.email],
        action={"label": "Sign in", "url": f"{settings.FRONTEND_URL}/login"},
    )
    result["sms"] = send_sms(
        user.phone,
        "Welcome to ZANHOTEL AJIRA PORTAL. Your Job Seeker account was created successfully.",
    )
    return result


def send_application_confirmation(application):
    result = send_portal_email(
        f"Application submitted: {application.job.title}",
        f"Your application was submitted successfully.\n\nJob: {application.job.title}\nHotel: {application.job.hotel.name}\nApplication date: {application.created_at:%d %B %Y}\nCurrent status: Pending",
        [application.applicant.email],
        action={
            "label": "View applications",
            "url": f"{settings.FRONTEND_URL}/jobseeker/dashboard/applications",
        },
    )
    result["sms"] = send_sms(
        application.applicant.phone,
        f"Application submitted: {application.job.title} at {application.job.hotel.name}. Status: Pending.",
    )
    return result


def send_application_status_email(application):
    decision = application.get_status_display()
    result = send_portal_email(
        f"Application {decision}: {application.job.title}",
        f"Hello {application.applicant.get_full_name()},\n\n{application.job.hotel.name} has updated your application for {application.job.title}.\n\nStatus: {decision}\nEmployer feedback: {application.feedback or 'No additional feedback was provided.'}",
        [application.applicant.email],
        action={
            "label": "View decision",
            "url": f"{settings.FRONTEND_URL}/jobseeker/dashboard/applications",
        },
    )
    result["sms"] = send_sms(
        application.applicant.phone,
        f"Your application for {application.job.title} is now {decision}.",
    )
    return result


def send_application_edited_email(application):
    """EN/SW: Notify hotel after applicant edit / Julisha hoteli ombi likihaririwa."""
    result = send_portal_email(
        f"Application updated: {application.job.title}",
        f"{application.applicant.get_full_name()} updated their pending application for {application.job.title}.\n\nApplicant note: {application.applicant_note or 'No note supplied.'}\n\nOpen the hotel dashboard to review the latest profile and documents.",
        [application.job.hotel.user.email],
        action={
            "label": "Review applications",
            "url": f"{settings.FRONTEND_URL}/hotel/dashboard/applications",
        },
    )
    result["sms"] = send_sms(
        application.job.hotel.user.phone,
        f"ZANHOTEL: {application.applicant.get_full_name()} updated an application for {application.job.title}.",
    )
    return result


def send_hotel_registration_email(hotel):
    result = send_portal_email(
        "Hotel registration received",
        f"Hello {hotel.name},\n\nYour registration was received successfully. The account remains inactive while the Ministry of Tourism verifies your information.",
        [hotel.user.email],
    )
    result["sms"] = send_sms(
        hotel.user.phone,
        "ZANHOTEL: Hotel registration received and awaiting Ministry approval.",
    )
    return result


def send_hotel_approval_email(hotel, approved=True):
    state = "approved" if approved else "not approved"
    message = f"Hello {hotel.name},\n\nYour hotel account has been {state}. " + (
        "You can now sign in and access the hotel dashboard."
        if approved
        else "Please contact the Ministry for further information."
    )
    result = send_portal_email(
        f"Hotel account {state}",
        message,
        [hotel.user.email],
        action=(
            {"label": "Hotel sign in", "url": f"{settings.FRONTEND_URL}/login"}
            if approved
            else None
        ),
    )
    result["sms"] = send_sms(
        hotel.user.phone, f"ZANHOTEL: Your hotel account is {state}."
    )
    return result


def send_new_job_email(job, recipients):
    return send_portal_email(
        f"New job: {job.title}",
        f"A new {job.category} opportunity was posted by {job.hotel.name}.\n\nPosition: {job.position}\nLocation: {job.hotel.location}\nExperience: {job.experience}\nDeadline: {job.deadline}",
        recipients,
        action={"label": "View job", "url": f"{settings.FRONTEND_URL}/jobs/{job.id}"},
    )


def send_maintenance_email(state, recipients):
    return send_portal_email(
        "ZanHotel Ajira Portal maintenance update",
        f"System maintenance is now {state}. We will keep you informed of further changes.",
        recipients,
    )


def send_admin_email(subject, message, recipients):
    return send_portal_email(subject, message, recipients, heading=subject)


def send_password_reset_email(user, uid, token):
    """EN/SW: Send secure reset link / Tuma link salama ya kubadili password."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
    return send_portal_email(
        "Reset your ZanHotel password",
        f"Hello {user.get_full_name() or user.username},\n\nA password reset was requested for your account. Use the secure link below. If you did not request this, ignore this email.",
        [user.email],
        action={"label": "Reset password", "url": reset_url},
    )
