"""
PDF RECRUITMENT REPORTS / RIPOTI ZA UAJIRI ZA PDF
EN: This service converts current database statistics into downloadable PDF files.
SW: Service hii hubadilisha takwimu za sasa za database kuwa PDF inayopakuliwa.
EN: Hotel reports are restricted to one hotel while Ministry reports cover the portal.
SW: Ripoti ya hoteli ina data yake pekee, huku ya Wizara ikijumuisha mfumo mzima.
EN/SW: Counts are calculated when requested, so the document never uses cached totals.
"""

from io import BytesIO

from django.db.models import Count, Max, Min, Q
from django.http import HttpResponse
from django.utils import timezone

from ..models import Application, Hotel, Job


def _pdf_response(title, summary, sections, filename):
    """Builds a styled PDF response from a summary and a collection of data tables."""
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4, landscape
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import mm
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    stream = BytesIO()
    document = SimpleDocTemplate(
        stream,
        pagesize=landscape(A4),
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
        title=title,
    )
    styles = getSampleStyleSheet()
    story = [
        Paragraph(title, styles["Title"]),
        Paragraph(
            f"Generated: {timezone.localtime().strftime('%d %B %Y, %H:%M')}",
            styles["Normal"],
        ),
        Spacer(1, 7 * mm),
    ]
    summary_table = Table([["Measure", "Value"], *summary], colWidths=[95 * mm, 70 * mm])
    summary_table.setStyle(_table_style(colors))
    story.extend([summary_table, Spacer(1, 8 * mm)])

    for heading, headers, rows in sections:
        story.extend([Paragraph(heading, styles["Heading2"]), Spacer(1, 2 * mm)])
        table_rows = [headers, *rows] if rows else [headers, ["No records", *([""] * (len(headers) - 1))]]
        table = Table(table_rows, repeatRows=1)
        table.setStyle(_table_style(colors))
        story.extend([table, Spacer(1, 7 * mm)])

    document.build(story)
    response = HttpResponse(stream.getvalue(), content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response


def _table_style(colors):
    """Keeps every report table readable with a dark-blue portal-style heading."""
    from reportlab.platypus import TableStyle

    return TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#073B5C")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#B8CDD8")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#EAF5F8")]),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )


def create_hotel_report(hotel):
    """Calculates vacancies, applications, departments and top jobs for one hotel."""
    jobs = list(
        Job.objects.filter(hotel=hotel).annotate(application_count=Count("applications"))
    )
    departments = list(
        Job.objects.filter(hotel=hotel)
        .values("category")
        .annotate(
            job_count=Count("id", distinct=True),
            application_count=Count("applications"),
            accepted_count=Count("applications", filter=Q(applications__status="accepted")),
        )
        .order_by("-accepted_count", "-job_count", "category")
    )
    top_job = max(jobs, key=lambda item: item.application_count, default=None)
    summary = [
        ["Jobs posted", len(jobs)],
        ["Applications received", sum(job.application_count for job in jobs)],
        ["Department hiring most", departments[0]["category"] if departments else "None"],
        ["Most-applied job", top_job.title if top_job else "None"],
    ]
    sections = [
        (
            "Department activity",
            ["Department", "Jobs posted", "Applications", "People hired"],
            [[row["category"], row["job_count"], row["application_count"], row["accepted_count"]] for row in departments],
        ),
        (
            "Vacancy activity",
            ["Job", "Position", "Department", "Applications", "Status"],
            [[job.title, job.position, job.category, job.application_count, "Active" if job.active else "Closed"] for job in jobs],
        ),
    ]
    return _pdf_response(f"{hotel.name} Recruitment Report", summary, sections, "hotel-recruitment-report.pdf")


def create_ministry_report():
    """Calculates portal-wide hiring frequency by hotel, department and position."""
    jobs = list(Job.objects.annotate(application_count=Count("applications")))
    hotels = list(
        Hotel.objects.values("id", "name", "location", "registration_number")
        .annotate(
            job_count=Count("jobs", distinct=True),
            active_job_count=Count("jobs", filter=Q(jobs__active=True), distinct=True),
            application_count=Count("jobs__applications"),
            accepted_count=Count("jobs__applications", filter=Q(jobs__applications__status="accepted")),
            first_job_date=Min("jobs__created_at"),
            latest_job_date=Max("jobs__created_at"),
        )
        .order_by("-job_count", "-accepted_count", "name")[:20]
    )
    for rank, hotel in enumerate(hotels, 1):
        departments_for_hotel = list(
            Job.objects.filter(hotel_id=hotel["id"])
            .values("category")
            .annotate(job_count=Count("id"))
            .order_by("-job_count", "category")
        )
        positions_for_hotel = list(
            Job.objects.filter(hotel_id=hotel["id"])
            .values("position")
            .annotate(job_count=Count("id"))
            .order_by("-job_count", "position")
        )
        first_date = hotel["first_job_date"]
        latest_date = hotel["latest_job_date"]
        active_months = max(((latest_date - first_date).days / 30.44) + 1, 1) if first_date else 1
        hotel.update(
            {
                "rank": rank,
                "jobs_per_month": round(hotel["job_count"] / active_months, 2),
                "top_department": departments_for_hotel[0]["category"] if departments_for_hotel else "None",
                "top_position": positions_for_hotel[0]["position"] if positions_for_hotel else "None",
            }
        )
    departments = list(
        Job.objects.values("category")
        .annotate(
            job_count=Count("id", distinct=True),
            application_count=Count("applications"),
            accepted_count=Count("applications", filter=Q(applications__status="accepted")),
        )
        .order_by("-accepted_count", "-job_count", "category")
    )
    positions = list(
        Job.objects.values("position")
        .annotate(
            job_count=Count("id", distinct=True),
            application_count=Count("applications"),
            accepted_count=Count("applications", filter=Q(applications__status="accepted")),
        )
        .order_by("-accepted_count", "-job_count", "position")
    )
    top_job = max(jobs, key=lambda item: item.application_count, default=None)
    summary = [
        ["Registered hotels", Hotel.objects.count()],
        ["Jobs posted", Job.objects.count()],
        ["Applications received", Application.objects.count()],
        ["Most frequent hiring hotel", hotels[0]["name"] if hotels else "None"],
        ["Department hiring most", departments[0]["category"] if departments else "None"],
        ["Most-applied job", top_job.title if top_job else "None"],
    ]
    sections = [
        (
            "Top 20 hotel hiring frequency (highest to lowest)",
            ["Rank / Hotel", "Location", "Jobs / Active", "Jobs per month", "Applications / Hired", "Top department / Position", "First / Latest post"],
            [
                [
                    f'#{x["rank"]} {x["name"]}',
                    x["location"],
                    f'{x["job_count"]} / {x["active_job_count"]}',
                    x["jobs_per_month"],
                    f'{x["application_count"]} / {x["accepted_count"]}',
                    f'{x["top_department"]} / {x["top_position"]}',
                    f'{x["first_job_date"].date() if x["first_job_date"] else "None"} / {x["latest_job_date"].date() if x["latest_job_date"] else "None"}',
                ]
                for x in hotels
            ],
        ),
        ("Department activity", ["Department", "Jobs", "Applications", "People hired"], [[x["category"], x["job_count"], x["application_count"], x["accepted_count"]] for x in departments]),
        ("Position activity", ["Position", "Jobs", "Applications", "People hired"], [[x["position"], x["job_count"], x["application_count"], x["accepted_count"]] for x in positions]),
    ]
    return _pdf_response("Ministry Recruitment Report", summary, sections, "ministry-recruitment-report.pdf")
