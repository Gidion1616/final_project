# ZANHOTEL-AJIRA-PORTAL

A full-stack recruitment portal for Zanzibar's hospitality sector. It supports three roles—Job Seeker, Hotel, and Ministry Admin—with approval-gated hotel access and profile-based applications.

## Technology

- React 18 + Vite frontend
- Django 5 backend and SQLite database
- Token authentication and role-based API authorization
- Local media storage for photos, certificates, CVs, licenses, and hotel images
- OpenStreetMap embeds for hotel locations

## Setup

Requirements: Node.js 20+, Python 3.11+.

### Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations portal
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The superuser can sign in through the portal's normal `/login` page and is directed to the Ministry dashboard. Django's built-in administration remains available at `/django-admin/`.

### Frontend

In a second terminal from the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Vite proxies `/api` and `/media` to Django at `http://localhost:8000`.

For a separately hosted API, copy `.env.example` to `.env` and set `VITE_API_URL` to its full API URL.

## Main flows

- Public visitors browse and filter vacancies. Home only displays jobs posted within the configured five-day window.
- Visitors who apply are sent to registration/login. Job seekers apply using their saved profile and documents.
- Self-registered hotels cannot sign in until approved on the Ministry Admin dashboard.
- Hotels post/edit/delete jobs, view application counts, see the most popular vacancy, inspect applicant documents, and provide a status and feedback.
- Admins approve hotels, control user/job visibility, see system totals, and change portal settings.

## Production notes

Before deployment, set `DEBUG=False`, move `SECRET_KEY` to an environment variable, configure production hosts/CORS, use PostgreSQL, and store uploaded media in private object storage. Uploaded identity and credential documents should not be exposed through a public media server in production.
