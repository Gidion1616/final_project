import json
from datetime import timedelta
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db.models import Count
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from .models import User, Hotel, Job, Application, ApiToken, SiteSetting
from .services.email_service import (
    send_admin_email,
    send_application_confirmation,
    send_application_edited_email,
    send_application_status_email,
    send_hotel_approval_email,
    send_hotel_registration_email,
    send_maintenance_email,
    send_new_job_email,
    send_password_reset_email,
    send_registration_email,
)

"""
MWONGOZO WA KAZI ZA API
-----------------------
email_service hutuma barua pepe za matukio bila kuchanganya email logic na API views.
body/url na kazi za *_data husoma maombi na kubadilisha rekodi kuwa JSON.
auth hukagua Token ya mtumiaji na kuhakikisha ana jukumu linaloruhusiwa.
register_jobseeker/register_hotel huhakiki fomu, mafaili na kutengeneza akaunti.
login_view/me huingia kwenye mfumo na kusoma au kusahihisha wasifu.
jobs/job_detail/apply_job/my_applications hushughulikia ajira na maombi ya kazi.
hotel_overview/hotel_jobs/hotel_job_detail/update_application ni kazi za hoteli.
admin_overview/approve_hotel/toggle_user/admin_job/settings_view ni kazi za Wizara.
"""


def body(request):
    """Husoma JSON kwa usalama; JSON tupu au mbovu hurudishwa kama kamusi tupu."""
    try:
        return json.loads(request.body or "{}")
    except:
        return {}


def url(request, f):
    """Hutengeneza anwani kamili ya faili lililopakiwa au maandishi matupu."""
    return request.build_absolute_uri(f.url) if f else ""


def user_data(request, u, private=False):
    """Hubadilisha User kuwa data ya JSON ya kawaida au ya siri kulingana na private."""
    d = {
        "id": u.id,
        "username": u.username,
        "full_name": u.get_full_name(),
        "email": u.email,
        "role": u.role,
        "phone": u.phone,
        "address": u.address,
        "photo": url(request, u.photo),
    }
    if private:
        d.update(
            {
                "date_of_birth": u.date_of_birth,
                "gender": u.gender,
                "cv": url(request, u.cv),
                "recommendation_letter": url(request, u.recommendation_letter),
                "academic_certificates": url(request, u.academic_certificates),
                "other_certificates": url(request, u.other_certificates),
                "is_active": u.is_active,
            }
        )
        if u.role == "hotel" and hasattr(u, "hotel"):
            h = u.hotel
            d["hotel"] = {
                "name": h.name,
                "location": h.location,
                "latitude": h.latitude,
                "longitude": h.longitude,
                "tin": h.tin,
                "registration_number": h.registration_number,
                "image": url(request, h.image),
                "business_license": url(request, h.business_license),
                "approved": h.approved,
            }
    return d


def job_data(request, j, detail=False):
    """Hubadilisha ajira kuwa JSON pamoja na hoteli, ramani na idadi ya waombaji."""
    d = {
        "id": j.id,
        "title": j.title,
        "position": j.position,
        "category": j.category,
        "experience": j.experience,
        "gender": j.gender,
        "deadline": j.deadline,
        "active": j.active,
        "created_at": j.created_at,
        "application_count": getattr(j, "application_count", j.applications.count()),
        "hotel": {
            "id": j.hotel_id,
            "name": j.hotel.name,
            "image": url(request, j.hotel.image),
            "location": j.hotel.location,
            "latitude": j.hotel.latitude,
            "longitude": j.hotel.longitude,
        },
    }
    if detail:
        d["description"] = j.description
    return d


def application_data(request, a, private=False):
    """Hubadilisha ombi kuwa JSON; private ikiwa kweli huongeza nyaraka za mwombaji."""
    d = {
        "id": a.id,
        "job": job_data(request, a.job, True),
        "applicant_note": a.applicant_note,
        "status": a.status,
        "feedback": a.feedback,
        "created_at": a.created_at,
        "updated_at": a.updated_at,
    }
    if private:
        d["applicant"] = user_data(request, a.applicant, True)
    return d


def auth(request, roles=None):
    """Hurudisha mtumiaji hai ikiwa Token ni sahihi na jukumu lake limeruhusiwa."""
    raw = request.headers.get("Authorization", "")
    if not raw.startswith("Token "):
        return None
    try:
        u = ApiToken.objects.select_related("user").get(key=raw[6:]).user
    except ApiToken.DoesNotExist:
        return None
    return (
        u if u.is_active and (not roles or u.role in roles or u.is_superuser) else None
    )


def denied():
    """Hurudisha kosa 401 pale mtumiaji hajaingia au hana ruhusa."""
    return JsonResponse(
        {"detail": "Authentication or permission required."}, status=401
    )


def require_fields(data, names):
    """Hutafuta majina ya sehemu muhimu ambazo hazikujazwa kwenye fomu."""
    return [n for n in names if not str(data.get(n, "")).strip()]


# ACCOUNT REGISTRATION / USAJILI WA AKAUNTI
# EN: These endpoints accept multipart forms because registrations include files.
# SW: Endpoint hizi hupokea multipart form kwa sababu usajili una mafaili.
# EN: Required fields, email, passwords, image and PDF types are validated first.
# SW: Fields, email, password, picha na aina za PDF hukaguliwa kabla ya kuhifadhi.
# EN: Job Seekers become active; Hotels remain blocked until Ministry approval.
# SW: Job Seeker huanza kutumia mfumo; Hoteli husubiri kwanza idhini ya Wizara.
# EN/SW: A welcome/receipt email is sent after success / Email hutumwa baada ya usajili.
@csrf_exempt
def register_jobseeker(request):
    """Huhakiki na kusajili Job Seeker, kisha hutuma ujumbe wa makaribisho."""
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    d = request.POST
    required = [
        "username",
        "full_name",
        "email",
        "phone",
        "address",
        "date_of_birth",
        "gender",
        "password",
        "confirm_password",
    ]
    missing = require_fields(d, required)
    docs = [
        "photo",
        "cv",
        "recommendation_letter",
        "academic_certificates",
        "other_certificates",
    ]
    missing += [x for x in docs if x not in request.FILES]
    if missing:
        return JsonResponse({"detail": "Required: " + ", ".join(missing)}, status=400)
    if not request.FILES["photo"].content_type.startswith("image/") or any(
        request.FILES[x].content_type != "application/pdf" for x in docs[1:]
    ):
        return JsonResponse(
            {"detail": "Photo must be an image and all documents must be PDF files."},
            status=400,
        )
    if d["password"] != d["confirm_password"]:
        return JsonResponse({"detail": "Passwords do not match."}, status=400)
    if User.objects.filter(username__iexact=d["username"]).exists():
        return JsonResponse({"detail": "Username already exists."}, status=400)
    try:
        validate_email(d["email"])
    except ValidationError:
        return JsonResponse({"detail": "Enter a valid email."}, status=400)
    first, *rest = d["full_name"].strip().split(" ", 1)
    u = User.objects.create_user(
        username=d["username"],
        password=d["password"],
        first_name=first,
        last_name=rest[0] if rest else "",
        email=d["email"],
        role="jobseeker",
        phone=d["phone"],
        address=d["address"],
        date_of_birth=d["date_of_birth"],
        gender=d["gender"],
        photo=request.FILES["photo"],
        cv=request.FILES["cv"],
        recommendation_letter=request.FILES["recommendation_letter"],
        academic_certificates=request.FILES["academic_certificates"],
        other_certificates=request.FILES.get("other_certificates"),
    )
    send_registration_email(u)
    return JsonResponse(
        {"detail": "Account created. Please sign in.", "user": user_data(request, u)},
        status=201,
    )


@csrf_exempt
def register_hotel(request):
    """Husajili hoteli ikiwa haijarudiwa na kuiweka ikisubiri idhini ya Wizara."""
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    d = request.POST
    required = [
        "name",
        "location",
        "latitude",
        "longitude",
        "tin",
        "registration_number",
        "email",
        "phone",
        "username",
        "password",
    ]
    missing = require_fields(d, required) + [
        x for x in ["image", "business_license"] if x not in request.FILES
    ]
    if missing:
        return JsonResponse({"detail": "Required: " + ", ".join(missing)}, status=400)
    if (
        not request.FILES["image"].content_type.startswith("image/")
        or request.FILES["business_license"].content_type != "application/pdf"
    ):
        return JsonResponse(
            {
                "detail": "Hotel image must be an image and business license must be a PDF."
            },
            status=400,
        )
    if (
        User.objects.filter(username__iexact=d["username"]).exists()
        or Hotel.objects.filter(tin=d["tin"]).exists()
    ):
        return JsonResponse(
            {"detail": "Username or TIN is already registered."}, status=400
        )
    u = User.objects.create_user(
        username=d["username"],
        password=d["password"],
        email=d["email"],
        first_name=d["name"],
        phone=d["phone"],
        address=d["location"],
        role="hotel",
    )
    try:
        latitude = float(d["latitude"])
        longitude = float(d["longitude"])
        if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
            raise ValueError
    except ValueError:
        u.delete()
        return JsonResponse(
            {"detail": "Enter valid latitude and longitude coordinates."}, status=400
        )
    h = Hotel.objects.create(
        user=u,
        name=d["name"],
        location=d["location"],
        latitude=latitude,
        longitude=longitude,
        tin=d["tin"],
        registration_number=d["registration_number"],
        image=request.FILES.get("image"),
        business_license=request.FILES.get("business_license"),
    )
    send_hotel_registration_email(h)
    return JsonResponse(
        {
            "detail": "Registration received. The Ministry must approve this account before login.",
            "hotel_id": h.id,
        },
        status=201,
    )


# AUTHENTICATION AND PROFILE / UTHIBITISHAJI NA WASIFU
# EN: Login verifies Django's hashed password and creates one API token per user.
# SW: Login hukagua password iliyohifadhiwa kwa hash na kutengeneza API token.
# EN: Hotel login additionally checks that the Ministry has approved the account.
# SW: Login ya hoteli pia hukagua kama akaunti imeidhinishwa na Wizara.
# EN: The me endpoint returns private profile data only to the authenticated owner.
# SW: Endpoint ya me humrudishia taarifa binafsi mwenye Token sahihi pekee.
# EN/SW: PATCH updates permitted profile fields / PATCH husahihisha fields zinazoruhusiwa.
@csrf_exempt
def login_view(request):
    """Hukagua username/password na kurudisha Token; hoteli lazima iwe imeidhinishwa."""
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    d = body(request)
    u = authenticate(username=d.get("username"), password=d.get("password"))
    if not u:
        return JsonResponse({"detail": "Invalid username or password."}, status=400)
    if u.role == "hotel" and not u.hotel.approved:
        return JsonResponse(
            {"detail": "Your hotel is awaiting Ministry approval."}, status=403
        )
    t, _ = ApiToken.objects.get_or_create(user=u)
    profile = user_data(request, u, True)
    if u.is_superuser:
        profile["role"] = "admin"
    return JsonResponse({"token": t.key, "user": profile})


@csrf_exempt
def password_reset_request(request):
    """
    EN: Create Django's time-limited reset token and email it without revealing accounts.
    SW: Tengeneza token ya muda na kuituma bila kufichua kama email ipo kwenye mfumo.
    EN: The response is deliberately identical for known and unknown addresses.
    SW: Jibu linafanana kwa email iliyopo na isiyopo kwa sababu za usalama.
    EN: No password is sent; the link contains a signed, expiring token.
    SW: Password haitumwi; link ina token salama yenye muda wa kuisha.
    """
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    email = body(request).get("email", "").strip().lower()
    user = User.objects.filter(email__iexact=email, is_active=True).first()
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        send_password_reset_email(user, uid, token)
    return JsonResponse(
        {"detail": "If that email is registered, a secure reset link has been sent."}
    )


@csrf_exempt
def password_reset_confirm(request, uid, token):
    """EN/SW: Validate reset token and save a new password / Hakiki token na hifadhi password mpya."""
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    d = body(request)
    if len(d.get("password", "")) < 8:
        return JsonResponse(
            {"detail": "Password must have at least 8 characters."}, status=400
        )
    if d.get("password") != d.get("confirm_password"):
        return JsonResponse({"detail": "Passwords do not match."}, status=400)
    try:
        user = User.objects.get(pk=force_str(urlsafe_base64_decode(uid)))
    except (User.DoesNotExist, ValueError, TypeError, OverflowError):
        return JsonResponse({"detail": "Invalid or expired reset link."}, status=400)
    if not default_token_generator.check_token(user, token):
        return JsonResponse({"detail": "Invalid or expired reset link."}, status=400)
    user.set_password(d["password"])
    user.save()
    ApiToken.objects.filter(user=user).delete()
    return JsonResponse(
        {"detail": "Password changed successfully. You can now sign in."}
    )


@csrf_exempt
def me(request):
    """Husoma wasifu wa aliyeingia na huruhusu kusahihisha taarifa zinazoruhusiwa."""
    u = auth(request)
    if not u:
        return denied()
    if request.method == "PATCH":
        # EN: Multipart is required when CV/certificates are changed; JSON still works.
        # SW: Multipart inahitajika kubadili CV/certificates; JSON bado inaruhusiwa.
        d = (
            request.POST
            if request.content_type and request.content_type.startswith("multipart/")
            else body(request)
        )
        for field in ["email", "phone", "address", "gender"]:
            setattr(u, field, d.get(field, getattr(u, field)))
        if d.get("username") and d["username"] != u.username:
            if (
                User.objects.filter(username__iexact=d["username"])
                .exclude(pk=u.pk)
                .exists()
            ):
                return JsonResponse(
                    {"detail": "Username is already in use."}, status=400
                )
            u.username = d["username"].strip()
        if d.get("full_name"):
            first, *rest = d["full_name"].strip().split(" ", 1)
            u.first_name = first
            u.last_name = rest[0] if rest else ""
        for field in [
            "cv",
            "recommendation_letter",
            "academic_certificates",
            "other_certificates",
        ]:
            uploaded = request.FILES.get(field)
            if uploaded:
                if uploaded.content_type != "application/pdf":
                    return JsonResponse(
                        {"detail": f"{field} must be a PDF file."}, status=400
                    )
                setattr(u, field, uploaded)
        photo = request.FILES.get("photo")
        if photo:
            if not photo.content_type.startswith("image/"):
                return JsonResponse({"detail": "Photo must be an image."}, status=400)
            u.photo = photo
        if u.role == "hotel" and hasattr(u, "hotel"):
            h = u.hotel
            for source, target in [
                ("hotel_name", "name"),
                ("location", "location"),
                ("latitude", "latitude"),
                ("longitude", "longitude"),
            ]:
                if d.get(source):
                    setattr(h, target, d[source])
            if (
                d.get("tin")
                and Hotel.objects.filter(tin=d["tin"]).exclude(pk=h.pk).exists()
            ):
                return JsonResponse(
                    {"detail": "TIN is already registered."}, status=400
                )
            if (
                d.get("registration_number")
                and Hotel.objects.filter(registration_number=d["registration_number"])
                .exclude(pk=h.pk)
                .exists()
            ):
                return JsonResponse(
                    {"detail": "Registration number is already registered."}, status=400
                )
            h.tin = d.get("tin", h.tin)
            h.registration_number = d.get("registration_number", h.registration_number)
            hotel_image = request.FILES.get("hotel_image")
            if hotel_image:
                if not hotel_image.content_type.startswith("image/"):
                    return JsonResponse(
                        {"detail": "Hotel image must be an image."}, status=400
                    )
                h.image = hotel_image
            license_file = request.FILES.get("business_license")
            if license_file:
                if license_file.content_type != "application/pdf":
                    return JsonResponse(
                        {"detail": "Business license must be a PDF."}, status=400
                    )
                h.business_license = license_file
            h.save()
        u.save()
        # EN: Pending applications use the live profile, so hotels see new documents.
        # SW: Maombi pending hutumia wasifu wa sasa, hivyo hoteli huona nyaraka mpya.
        if request.FILES:
            for application in Application.objects.filter(
                applicant=u, status="pending"
            ).select_related("job__hotel__user"):
                send_application_edited_email(application)
    return JsonResponse(user_data(request, u, True))


# PUBLIC JOBS / AJIRA ZA UMMA
# EN: This section lists active jobs from Ministry-approved hotels only.
# SW: Sehemu hii huorodhesha ajira hai za hoteli zilizoidhinishwa na Wizara pekee.
# EN: Normal /jobs requests return every active job whose deadline has not passed.
# SW: Ombi la kawaida /jobs hurudisha ajira zote hai ambazo deadline haijapita.
# EN: The recent parameter adds a three-day Home-page filter without deleting jobs.
# SW: recent huongeza kichujio cha siku tatu cha Home bila kufuta ajira kwenye database.
def jobs(request):
    """
    EN: Return active jobs and apply optional search, category and recent filters.
    SW: Rudisha ajira hai na tumia search, category na recent kama zimetumwa.
    EN: recent=1 is used by Home and reads the fixed HOME_RECENT_JOBS_DAYS value.
    SW: recent=1 hutumiwa na Home na husoma HOME_RECENT_JOBS_DAYS yenye siku 3.
    EN: A job older than that remains in /jobs until inactive, expired, or deleted.
    SW: Ajira ikizidi siku hizo hubaki /jobs hadi ifungwe, deadline ipite au ifutwe.
    """
    qs = (
        Job.objects.select_related("hotel")
        .filter(active=True, hotel__approved=True, deadline__gte=timezone.localdate())
        .annotate(application_count=Count("applications"))
    )
    q = request.GET.get("q", "").strip()
    cat = request.GET.get("category", "").strip()
    recent = request.GET.get("recent")
    if q:
        qs = (
            qs.filter(title__icontains=q)
            | qs.filter(position__icontains=q)
            | qs.filter(hotel__name__icontains=q)
            | qs.filter(hotel__location__icontains=q)
        )
    if cat:
        qs = qs.filter(category__iexact=cat)
    if recent:
        qs = qs.filter(
            created_at__gte=timezone.now()
            - timedelta(days=settings.HOME_RECENT_JOBS_DAYS)
        )
    return JsonResponse(
        {
            "results": [job_data(request, j) for j in qs.order_by("-created_at")],
            "categories": list(
                Job.objects.filter(active=True)
                .values_list("category", flat=True)
                .distinct()
            ),
        }
    )


def job_detail(request, pk):
    """Hurudisha maelezo kamili ya ajira moja inayotambuliwa kwa primary key."""
    return JsonResponse(
        job_data(
            request, get_object_or_404(Job.objects.select_related("hotel"), pk=pk), True
        )
    )


@csrf_exempt
def apply_job(request, pk):
    """Hutengeneza ombi moja la ajira kwa Job Seeker bila kuruhusu marudio."""
    u = auth(request, ["jobseeker"])
    if not u:
        return denied()
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    j = get_object_or_404(Job, pk=pk, active=True)
    a, created = Application.objects.get_or_create(job=j, applicant=u)
    # EN: Send confirmation only for a newly created application, never duplicates.
    # SW: Tuma uthibitisho kwa ombi jipya pekee ili email isijirudie.
    if created:
        send_application_confirmation(a)
    return JsonResponse(
        {
            "detail": "Application submitted.",
            "application": application_data(request, a),
        },
        status=201 if created else 200,
    )


def my_applications(request):
    """Hurudisha maombi yote yanayomilikiwa na Job Seeker aliyeingia."""
    u = auth(request, ["jobseeker"])
    if not u:
        return denied()
    return JsonResponse(
        {
            "results": [
                application_data(request, a)
                for a in Application.objects.filter(applicant=u).select_related(
                    "job__hotel"
                )
            ]
        }
    )


@csrf_exempt
def manage_my_application(request, pk):
    """Huruhusu Job Seeker kubadili ujumbe wa ombi pending au kufuta ombi lake."""
    u = auth(request, ["jobseeker"])
    if not u:
        return denied()
    a = get_object_or_404(Application, pk=pk, applicant=u)
    if request.method == "DELETE":
        a.delete()
        return JsonResponse({"detail": "Application deleted."})
    if request.method == "PATCH":
        if a.status != "pending":
            return JsonResponse(
                {"detail": "Only pending applications can be edited."}, status=400
            )
        a.applicant_note = body(request).get("applicant_note", a.applicant_note).strip()
        a.save()
        send_application_edited_email(a)
        return JsonResponse(application_data(request, a))
    return JsonResponse({"detail": "Method not allowed"}, status=405)


@csrf_exempt
def clear_my_applications(request):
    """Hufuta maombi yote yanayomilikiwa na Job Seeker aliyeingia."""
    u = auth(request, ["jobseeker"])
    if not u:
        return denied()
    if request.method != "DELETE":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    deleted, _ = Application.objects.filter(applicant=u).delete()
    return JsonResponse({"detail": f"{deleted} application(s) cleared."})


# HOTEL WORKSPACE / ENEO LA HOTELI
# EN: Every query is restricted to jobs owned by the authenticated hotel.
# SW: Kila query inaruhusu ajira zinazomilikiwa na hoteli iliyoingia pekee.
# EN: GET reads data, POST creates, PATCH edits and DELETE removes a vacancy.
# SW: GET husoma, POST hutengeneza, PATCH husahihisha na DELETE hufuta ajira.
# EN: Application totals and the highest-performing vacancy are calculated here.
# SW: Jumla ya maombi na ajira yenye waombaji wengi hukokotolewa hapa.
# EN/SW: Status changes notify applicants by email / Mabadiliko hutuma email kwa mwombaji.
def hotel_overview(request):
    """Hukokotoa jumla za ajira/maombi na kubaini ajira yenye waombaji wengi."""
    u = auth(request, ["hotel"])
    if not u:
        return denied()
    jobs = Job.objects.filter(hotel=u.hotel).annotate(
        application_count=Count("applications")
    )
    top = max([j.application_count for j in jobs] or [0])
    return JsonResponse(
        {
            "hotel": {"name": u.hotel.name, "approved": u.hotel.approved},
            "total_jobs": jobs.count(),
            "total_applications": sum(j.application_count for j in jobs),
            "jobs": [
                job_data(request, j)
                | {"highest": j.application_count == top and top > 0}
                for j in jobs
            ],
        }
    )


@csrf_exempt
def hotel_jobs(request):
    """GET huorodhesha ajira za hoteli; POST hutangaza ajira na kutuma barua pepe."""
    u = auth(request, ["hotel"])
    if not u:
        return denied()
    if request.method == "GET":
        return JsonResponse(
            {
                "results": [
                    job_data(request, j, True)
                    for j in Job.objects.filter(hotel=u.hotel).annotate(
                        application_count=Count("applications")
                    )
                ]
            }
        )
    d = body(request)
    missing = require_fields(
        d, ["title", "position", "category", "description", "experience", "deadline"]
    )
    if missing:
        return JsonResponse({"detail": "Required: " + ", ".join(missing)}, status=400)
    j = Job.objects.create(
        hotel=u.hotel,
        title=d["title"],
        position=d["position"],
        category=d["category"],
        description=d["description"],
        experience=d["experience"],
        gender=d.get("gender", "Any"),
        deadline=d["deadline"],
    )
    send_new_job_email(
        j,
        User.objects.filter(role="jobseeker", is_active=True).values_list(
            "email", flat=True
        ),
    )
    return JsonResponse(job_data(request, j, True), status=201)


@csrf_exempt
def hotel_job_detail(request, pk):
    """Husoma, kusahihisha au kufuta ajira inayomilikiwa na hoteli husika."""
    u = auth(request, ["hotel"])
    if not u:
        return denied()
    j = get_object_or_404(Job, pk=pk, hotel=u.hotel)
    if request.method == "DELETE":
        j.delete()
        return JsonResponse({"detail": "Job deleted."})
    if request.method == "PATCH":
        d = body(request)
        for f in [
            "title",
            "position",
            "category",
            "description",
            "experience",
            "gender",
            "deadline",
            "active",
        ]:
            if f in d:
                value = d[f]
                if f == "active":
                    value = value is True or str(value).lower() in [
                        "true",
                        "1",
                        "on",
                        "yes",
                    ]
                setattr(j, f, value)
        j.save()
        return JsonResponse(job_data(request, j, True))
    return JsonResponse(
        {
            "job": job_data(request, j, True),
            "applications": [
                application_data(request, a, True)
                for a in j.applications.select_related("applicant").all()
            ],
        }
    )


@csrf_exempt
def update_application(request, pk):
    """Hoteli hubadili hali/feedback ya ombi na mwombaji hujulishwa kwa email."""
    u = auth(request, ["hotel"])
    if not u:
        return denied()
    a = get_object_or_404(Application, pk=pk, job__hotel=u.hotel)
    d = body(request)
    if d.get("status") not in dict(Application.STATUS):
        return JsonResponse({"detail": "Invalid status."}, status=400)
    previous_status = a.status
    a.status = d["status"]
    a.feedback = d.get("feedback", a.feedback)
    a.save()
    # EN: Notify only when the decision changes, not when feedback alone is saved.
    # SW: Email hutumwa status ikibadilika pekee, si feedback ikihifadhiwa tena.
    if previous_status != a.status:
        send_application_status_email(a)
    return JsonResponse(application_data(request, a, True))


# MINISTRY ADMINISTRATION / UTAWALA WA WIZARA
# EN: These endpoints require the admin role or a Django superuser account.
# SW: Endpoint hizi zinahitaji role ya admin au akaunti ya Django superuser.
# EN: Admin can approve hotels, suspend users, moderate jobs and view totals.
# SW: Admin anaidhinisha hoteli, kusimamisha users, kusimamia ajira na kuona takwimu.
# EN: Settings control portal identity and maintenance; recent jobs stay fixed at 3 days.
# SW: Settings hudhibiti jina/maintenance; muda wa ajira mpya unabaki siku 3.
# EN/SW: Maintenance changes notify active users / Mabadiliko ya maintenance hutuma email.
def admin_overview(request):
    """Hurudisha takwimu na orodha za mfumo kwa dashboard ya Admin."""
    u = auth(request, ["admin"])
    if not u:
        return denied()
    return JsonResponse(
        {
            "stats": {
                "jobseekers": User.objects.filter(role="jobseeker").count(),
                "hotels": Hotel.objects.count(),
                "pending_hotels": Hotel.objects.filter(approved=False).count(),
                "jobs": Job.objects.count(),
                "applications": Application.objects.count(),
            },
            "hotels": [
                {
                    "id": h.id,
                    "user_id": h.user_id,
                    "name": h.name,
                    "location": h.location,
                    "tin": h.tin,
                    "registration_number": h.registration_number,
                    "approved": h.approved,
                    "email": h.user.email,
                }
                for h in Hotel.objects.select_related("user")
            ],
            "users": [
                user_data(request, x, True)
                for x in User.objects.filter(role="jobseeker")
            ],
            "jobs": [
                job_data(request, j, True)
                for j in Job.objects.select_related("hotel").all()
            ],
        }
    )


@csrf_exempt
def approve_hotel(request, pk):
    """Admin huidhinisha au kuondoa idhini ya akaunti ya hoteli."""
    u = auth(request, ["admin"])
    if not u:
        return denied()
    h = get_object_or_404(Hotel, pk=pk)
    previous_approval = h.approved
    h.approved = body(request).get("approved", True)
    h.save()
    # EN/SW: Send once only when approval value changes / Tuma status ikibadilika pekee.
    if previous_approval != h.approved:
        send_hotel_approval_email(h, h.approved)
    return JsonResponse({"approved": h.approved})


@csrf_exempt
def admin_email_management(request):
    """
    EN: GET supplies safe recipient choices; POST sends individual or group messages.
    SW: GET hutoa orodha salama; POST hutuma ujumbe kwa mtu au kundi.
    EN: Only admin/superuser tokens can use this endpoint.
    SW: Admin au superuser mwenye Token ndiye anayeruhusiwa kutumia endpoint.
    EN: Bulk delivery is one email at a time, never To/CC with exposed addresses.
    SW: Email za kundi hutumwa moja moja bila kuonyesha anuani za watu wengine.
    """
    u = auth(request, ["admin"])
    if not u:
        return denied()
    users = (
        User.objects.filter(is_active=True)
        .exclude(email="")
        .order_by("role", "first_name")
    )
    if request.method == "GET":
        return JsonResponse(
            {
                "recipients": [
                    {
                        "id": user.id,
                        "name": user.get_full_name() or user.username,
                        "email": user.email,
                        "role": "admin" if user.is_superuser else user.role,
                    }
                    for user in users
                ]
            }
        )
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    d = body(request)
    subject = d.get("subject", "").strip()
    message = d.get("message", "").strip()
    recipient_type = d.get("recipient_type", "individual")
    if not subject or not message:
        return JsonResponse({"detail": "Subject and message are required."}, status=400)
    if recipient_type == "individual":
        recipients = users.filter(pk=d.get("user_id")).values_list("email", flat=True)
    elif recipient_type == "jobseekers":
        recipients = users.filter(role="jobseeker").values_list("email", flat=True)
    elif recipient_type == "hotels":
        recipients = users.filter(role="hotel").values_list("email", flat=True)
    elif recipient_type == "all":
        recipients = users.values_list("email", flat=True)
    else:
        return JsonResponse({"detail": "Invalid recipient group."}, status=400)
    result = send_admin_email(subject, message, recipients)
    if not result["sent"]:
        first_error = (
            result["errors"][0]
            if result["errors"]
            else "SMTP provider rejected delivery."
        )
        return JsonResponse(
            {
                "detail": f"No email was delivered: {first_error}",
                "errors": result["errors"],
            },
            status=502,
        )
    return JsonResponse(
        {
            "detail": f'{result["sent"]} email(s) sent successfully.',
            "errors": result["errors"],
        }
    )


@csrf_exempt
def site_content(request):
    """
    EN: GET supplies Home text/image; PATCH is restricted to Admin.
    SW: GET hutoa content ya Home; PATCH inaruhusiwa kwa Admin pekee.
    EN: Multipart lets the administrator upload a replacement hero image.
    SW: Multipart humruhusu Admin kupakia picha mpya ya hero.
    EN/SW: No selected image keeps the current one / Bila picha mpya ya zamani hubaki.
    """
    setting, _ = SiteSetting.objects.get_or_create(pk=1)
    if request.method == "GET":
        return JsonResponse(
            {
                "hero_eyebrow": setting.hero_eyebrow,
                "hero_title": setting.hero_title,
                "hero_subtitle": setting.hero_subtitle,
                "hero_image": url(request, setting.hero_image),
            }
        )
    admin_user = auth(request, ["admin"])
    if not admin_user:
        return denied()
    if request.method != "PATCH":
        return JsonResponse({"detail": "Method not allowed"}, status=405)
    for field in ["hero_eyebrow", "hero_title", "hero_subtitle"]:
        if request.POST.get(field):
            setattr(setting, field, request.POST[field])
    image = request.FILES.get("hero_image")
    if image:
        if not image.content_type.startswith("image/"):
            return JsonResponse({"detail": "Hero image must be an image."}, status=400)
        setting.hero_image = image
    setting.save()
    return JsonResponse({"detail": "Home page updated successfully."})


@csrf_exempt
def toggle_user(request, pk):
    """Admin huwasha au husimamisha akaunti ya mtumiaji."""
    u = auth(request, ["admin"])
    if not u:
        return denied()
    target = get_object_or_404(User, pk=pk)
    target.is_active = not target.is_active
    target.save()
    return JsonResponse({"is_active": target.is_active})


@csrf_exempt
def admin_job(request, pk):
    """Admin hubadili uonekano wa ajira au kuifuta kabisa."""
    u = auth(request, ["admin"])
    if not u:
        return denied()
    j = get_object_or_404(Job, pk=pk)
    if request.method == "DELETE":
        j.delete()
        return JsonResponse({"detail": "Job removed."})
    j.active = body(request).get("active", not j.active)
    j.save()
    return JsonResponse({"active": j.active})


@csrf_exempt
def settings_view(request):
    """Husoma/kubadili mipangilio na kutuma taarifa hali ya maintenance ikibadilika."""
    u = auth(request, ["admin"])
    if not u:
        return denied()
    s, _ = SiteSetting.objects.get_or_create(pk=1)
    if request.method == "PATCH":
        d = body(request)
        previous_maintenance = s.maintenance_mode
        for f in ["portal_name", "support_email", "maintenance_mode"]:
            if f in d:
                setattr(s, f, d[f])
        s.save()
        if "maintenance_mode" in d and s.maintenance_mode != previous_maintenance:
            state = "scheduled/active" if s.maintenance_mode else "completed"
            send_maintenance_email(
                state,
                User.objects.filter(is_active=True).values_list("email", flat=True),
            )
    return JsonResponse(
        {
            "portal_name": s.portal_name,
            "support_email": s.support_email,
            "maintenance_mode": s.maintenance_mode,
            "recent_jobs_days": s.recent_jobs_days,
        }
    )
