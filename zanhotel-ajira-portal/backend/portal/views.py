import json,logging
from datetime import timedelta
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db.models import Count
from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from .models import User,Hotel,Job,Application,ApiToken,SiteSetting
logger=logging.getLogger(__name__)

"""
API FUNCTION GUIDE
------------------
notify sends event emails without breaking the user's request if SMTP is down.
body/url and the *_data functions parse requests and serialize database records.
auth validates a Token header and enforces the allowed user roles.
register_jobseeker/register_hotel validate uploads and create inactive/active accounts.
login_view/me authenticate users and read/update the current profile.
jobs/job_detail/apply_job/my_applications implement public jobs and job seeker flows.
hotel_overview/hotel_jobs/hotel_job_detail/update_application implement hotel work.
admin_overview/approve_hotel/toggle_user/admin_job/settings_view implement Ministry work.
"""

def notify(subject,message,recipients):
 """Deliver one private email per recipient and log SMTP errors for diagnosis."""
 recipients=[email for email in set(recipients) if email]
 for email in recipients:
  try:send_mail(subject,message,settings.DEFAULT_FROM_EMAIL,[email],fail_silently=False)
  except Exception:logger.exception('Email delivery failed for %s',email)

def body(request):
 """Safely parse a JSON request body; invalid or empty JSON becomes an object."""
 try:return json.loads(request.body or '{}')
 except:return {}
def url(request,f):return request.build_absolute_uri(f.url) if f else ''
def user_data(request,u,private=False):
 """Convert a User model to JSON-safe public or private profile data."""
 d={'id':u.id,'username':u.username,'full_name':u.get_full_name(),'email':u.email,'role':u.role,'phone':u.phone,'address':u.address,'photo':url(request,u.photo)}
 if private:d.update({'date_of_birth':u.date_of_birth,'gender':u.gender,'cv':url(request,u.cv),'recommendation_letter':url(request,u.recommendation_letter),'academic_certificates':url(request,u.academic_certificates),'other_certificates':url(request,u.other_certificates),'is_active':u.is_active})
 return d
def job_data(request,j,detail=False):
 """Serialize a job together with hotel, map, and application-count data."""
 d={'id':j.id,'title':j.title,'position':j.position,'category':j.category,'experience':j.experience,'gender':j.gender,'deadline':j.deadline,'active':j.active,'created_at':j.created_at,'application_count':getattr(j,'application_count',j.applications.count()),'hotel':{'id':j.hotel_id,'name':j.hotel.name,'image':url(request,j.hotel.image),'location':j.hotel.location,'latitude':j.hotel.latitude,'longitude':j.hotel.longitude}}
 if detail:d['description']=j.description
 return d
def application_data(request,a,private=False):
 """Serialize an application and optionally include private applicant files."""
 d={'id':a.id,'job':job_data(request,a.job,True),'applicant_note':a.applicant_note,'status':a.status,'feedback':a.feedback,'created_at':a.created_at,'updated_at':a.updated_at}
 if private:d['applicant']=user_data(request,a.applicant,True)
 return d
def auth(request,roles=None):
 """Return the authenticated active user only when their role is permitted."""
 raw=request.headers.get('Authorization','')
 if not raw.startswith('Token '):return None
 try:u=ApiToken.objects.select_related('user').get(key=raw[6:]).user
 except ApiToken.DoesNotExist:return None
 return u if u.is_active and (not roles or u.role in roles or u.is_superuser) else None
def denied():return JsonResponse({'detail':'Authentication or permission required.'},status=401)
def require_fields(data,names):return [n for n in names if not str(data.get(n,'')).strip()]

# ACCOUNT REGISTRATION: handles multipart profile fields and uploaded documents.
@csrf_exempt
def register_jobseeker(request):
 if request.method!='POST':return JsonResponse({'detail':'Method not allowed'},status=405)
 d=request.POST;required=['username','full_name','email','phone','address','date_of_birth','gender','password','confirm_password'];missing=require_fields(d,required)
 docs=['photo','cv','recommendation_letter','academic_certificates','other_certificates'];missing += [x for x in docs if x not in request.FILES]
 if missing:return JsonResponse({'detail':'Required: '+', '.join(missing)},status=400)
 if not request.FILES['photo'].content_type.startswith('image/') or any(request.FILES[x].content_type!='application/pdf' for x in docs[1:]):return JsonResponse({'detail':'Photo must be an image and all documents must be PDF files.'},status=400)
 if d['password']!=d['confirm_password']:return JsonResponse({'detail':'Passwords do not match.'},status=400)
 if User.objects.filter(username__iexact=d['username']).exists():return JsonResponse({'detail':'Username already exists.'},status=400)
 try:validate_email(d['email'])
 except ValidationError:return JsonResponse({'detail':'Enter a valid email.'},status=400)
 first,*rest=d['full_name'].strip().split(' ',1);u=User.objects.create_user(username=d['username'],password=d['password'],first_name=first,last_name=rest[0] if rest else '',email=d['email'],role='jobseeker',phone=d['phone'],address=d['address'],date_of_birth=d['date_of_birth'],gender=d['gender'],photo=request.FILES['photo'],cv=request.FILES['cv'],recommendation_letter=request.FILES['recommendation_letter'],academic_certificates=request.FILES['academic_certificates'],other_certificates=request.FILES.get('other_certificates'))
 notify('Welcome to ZanHotel Ajira Portal',f'Hello {u.get_full_name()},\n\nYour Job Seeker account has been registered successfully. You can now sign in, browse verified vacancies, and track your applications.\n\nZanHotel Ajira Portal', [u.email])
 return JsonResponse({'detail':'Account created. Please sign in.','user':user_data(request,u)},status=201)

@csrf_exempt
def register_hotel(request):
 if request.method!='POST':return JsonResponse({'detail':'Method not allowed'},status=405)
 d=request.POST;required=['name','location','latitude','longitude','tin','registration_number','email','phone','username','password'];missing=require_fields(d,required)+[x for x in ['image','business_license'] if x not in request.FILES]
 if missing:return JsonResponse({'detail':'Required: '+', '.join(missing)},status=400)
 if not request.FILES['image'].content_type.startswith('image/') or request.FILES['business_license'].content_type!='application/pdf':return JsonResponse({'detail':'Hotel image must be an image and business license must be a PDF.'},status=400)
 if User.objects.filter(username__iexact=d['username']).exists() or Hotel.objects.filter(tin=d['tin']).exists():return JsonResponse({'detail':'Username or TIN is already registered.'},status=400)
 u=User.objects.create_user(username=d['username'],password=d['password'],email=d['email'],first_name=d['name'],phone=d['phone'],address=d['location'],role='hotel')
 try:
  latitude=float(d['latitude']);longitude=float(d['longitude'])
  if not (-90<=latitude<=90 and -180<=longitude<=180):raise ValueError
 except ValueError:
  u.delete();return JsonResponse({'detail':'Enter valid latitude and longitude coordinates.'},status=400)
 h=Hotel.objects.create(user=u,name=d['name'],location=d['location'],latitude=latitude,longitude=longitude,tin=d['tin'],registration_number=d['registration_number'],image=request.FILES.get('image'),business_license=request.FILES.get('business_license'))
 notify('Hotel registration received',f'Hello {h.name},\n\nYour hotel registration was received. The account will remain inactive until the Ministry of Tourism completes verification.\n\nZanHotel Ajira Portal',[u.email])
 return JsonResponse({'detail':'Registration received. The Ministry must approve this account before login.','hotel_id':h.id},status=201)

# AUTHENTICATION AND PROFILE: creates tokens and manages the current user.
@csrf_exempt
def login_view(request):
 if request.method!='POST':return JsonResponse({'detail':'Method not allowed'},status=405)
 d=body(request);u=authenticate(username=d.get('username'),password=d.get('password'))
 if not u:return JsonResponse({'detail':'Invalid username or password.'},status=400)
 if u.role=='hotel' and not u.hotel.approved:return JsonResponse({'detail':'Your hotel is awaiting Ministry approval.'},status=403)
 t,_=ApiToken.objects.get_or_create(user=u);profile=user_data(request,u,True)
 if u.is_superuser:profile['role']='admin'
 return JsonResponse({'token':t.key,'user':profile})

@csrf_exempt
def me(request):
 u=auth(request)
 if not u:return denied()
 if request.method=='PATCH':
  d=body(request)
  for field in ['email','phone','address','gender']:setattr(u,field,d.get(field,getattr(u,field)))
  if d.get('full_name'):u.first_name=d['full_name'];u.last_name=''
  u.save()
 return JsonResponse(user_data(request,u,True))

# PUBLIC/JOB SEEKER JOBS: browsing, filtering, applying, and tracking applications.
def jobs(request):
 qs=Job.objects.select_related('hotel').filter(active=True,hotel__approved=True,deadline__gte=timezone.localdate()).annotate(application_count=Count('applications'))
 q=request.GET.get('q','').strip();cat=request.GET.get('category','').strip();recent=request.GET.get('recent')
 if q:qs=qs.filter(title__icontains=q)|qs.filter(position__icontains=q)|qs.filter(hotel__name__icontains=q)|qs.filter(hotel__location__icontains=q)
 if cat:qs=qs.filter(category__iexact=cat)
 if recent:qs=qs.filter(created_at__gte=timezone.now()-timedelta(days=SiteSetting.objects.first().recent_jobs_days if SiteSetting.objects.exists() else 5))
 return JsonResponse({'results':[job_data(request,j) for j in qs.order_by('-created_at')],'categories':list(Job.objects.filter(active=True).values_list('category',flat=True).distinct())})
def job_detail(request,pk):return JsonResponse(job_data(request,get_object_or_404(Job.objects.select_related('hotel'),pk=pk),True))
@csrf_exempt
def apply_job(request,pk):
 u=auth(request,['jobseeker'])
 if not u:return denied()
 if request.method!='POST':return JsonResponse({'detail':'Method not allowed'},status=405)
 j=get_object_or_404(Job,pk=pk,active=True);a,created=Application.objects.get_or_create(job=j,applicant=u)
 return JsonResponse({'detail':'Application submitted.','application':application_data(request,a)},status=201 if created else 200)
def my_applications(request):
 u=auth(request,['jobseeker'])
 if not u:return denied()
 return JsonResponse({'results':[application_data(request,a) for a in Application.objects.filter(applicant=u).select_related('job__hotel')]})

@csrf_exempt
def manage_my_application(request,pk):
 """Allow a Job Seeker to edit their note or delete their own application."""
 u=auth(request,['jobseeker'])
 if not u:return denied()
 a=get_object_or_404(Application,pk=pk,applicant=u)
 if request.method=='DELETE':a.delete();return JsonResponse({'detail':'Application deleted.'})
 if request.method=='PATCH':
  if a.status!='pending':return JsonResponse({'detail':'Only pending applications can be edited.'},status=400)
  a.applicant_note=body(request).get('applicant_note',a.applicant_note).strip();a.save()
  return JsonResponse(application_data(request,a))
 return JsonResponse({'detail':'Method not allowed'},status=405)

@csrf_exempt
def clear_my_applications(request):
 """Delete all applications belonging to the authenticated Job Seeker."""
 u=auth(request,['jobseeker'])
 if not u:return denied()
 if request.method!='DELETE':return JsonResponse({'detail':'Method not allowed'},status=405)
 deleted,_=Application.objects.filter(applicant=u).delete()
 return JsonResponse({'detail':f'{deleted} application(s) cleared.'})

# HOTEL WORKSPACE: statistics, vacancy CRUD, applicant review, and responses.
def hotel_overview(request):
 u=auth(request,['hotel'])
 if not u:return denied()
 jobs=Job.objects.filter(hotel=u.hotel).annotate(application_count=Count('applications'));top=max([j.application_count for j in jobs] or [0])
 return JsonResponse({'hotel':{'name':u.hotel.name,'approved':u.hotel.approved},'total_jobs':jobs.count(),'total_applications':sum(j.application_count for j in jobs),'jobs':[job_data(request,j) | {'highest':j.application_count==top and top>0} for j in jobs]})
@csrf_exempt
def hotel_jobs(request):
 u=auth(request,['hotel'])
 if not u:return denied()
 if request.method=='GET':return JsonResponse({'results':[job_data(request,j,True) for j in Job.objects.filter(hotel=u.hotel).annotate(application_count=Count('applications'))]})
 d=body(request);missing=require_fields(d,['title','position','category','description','experience','deadline'])
 if missing:return JsonResponse({'detail':'Required: '+', '.join(missing)},status=400)
 j=Job.objects.create(hotel=u.hotel,title=d['title'],position=d['position'],category=d['category'],description=d['description'],experience=d['experience'],gender=d.get('gender','Any'),deadline=d['deadline'])
 notify(f'New job: {j.title}',f'A new {j.category} opportunity has been posted by {j.hotel.name}.\n\nPosition: {j.position}\nLocation: {j.hotel.location}\nExperience: {j.experience}\nDeadline: {j.deadline}\n\nSign in to ZanHotel Ajira Portal to view and apply.',User.objects.filter(role='jobseeker',is_active=True).values_list('email',flat=True))
 return JsonResponse(job_data(request,j,True),status=201)
@csrf_exempt
def hotel_job_detail(request,pk):
 u=auth(request,['hotel'])
 if not u:return denied()
 j=get_object_or_404(Job,pk=pk,hotel=u.hotel)
 if request.method=='DELETE':j.delete();return JsonResponse({'detail':'Job deleted.'})
 if request.method=='PATCH':
  d=body(request)
  for f in ['title','position','category','description','experience','gender','deadline','active']:
   if f in d:setattr(j,f,d[f])
  j.save();return JsonResponse(job_data(request,j,True))
 return JsonResponse({'job':job_data(request,j,True),'applications':[application_data(request,a,True) for a in j.applications.select_related('applicant').all()]})
@csrf_exempt
def update_application(request,pk):
 u=auth(request,['hotel'])
 if not u:return denied()
 a=get_object_or_404(Application,pk=pk,job__hotel=u.hotel);d=body(request)
 if d.get('status') not in dict(Application.STATUS):return JsonResponse({'detail':'Invalid status.'},status=400)
 a.status=d['status'];a.feedback=d.get('feedback',a.feedback);a.save()
 notify(f'Application update: {a.job.title}',f'Hello {a.applicant.get_full_name()},\n\n{a.job.hotel.name} has updated your application for {a.job.title}.\n\nStatus: {a.get_status_display()}\nFeedback: {a.feedback or "No feedback provided."}\n\nSign in to view the complete application.',[a.applicant.email])
 return JsonResponse(application_data(request,a,True))

# MINISTRY ADMINISTRATION: approvals, access, moderation, and system settings.
def admin_overview(request):
 u=auth(request,['admin'])
 if not u:return denied()
 return JsonResponse({'stats':{'jobseekers':User.objects.filter(role='jobseeker').count(),'hotels':Hotel.objects.count(),'pending_hotels':Hotel.objects.filter(approved=False).count(),'jobs':Job.objects.count(),'applications':Application.objects.count()},'hotels':[{'id':h.id,'name':h.name,'location':h.location,'tin':h.tin,'registration_number':h.registration_number,'approved':h.approved,'email':h.user.email} for h in Hotel.objects.select_related('user')],'users':[user_data(request,x,True) for x in User.objects.filter(role='jobseeker')],'jobs':[job_data(request,j,True) for j in Job.objects.select_related('hotel').all()]})
@csrf_exempt
def approve_hotel(request,pk):
 u=auth(request,['admin'])
 if not u:return denied()
 h=get_object_or_404(Hotel,pk=pk);h.approved=body(request).get('approved',True);h.save();return JsonResponse({'approved':h.approved})
@csrf_exempt
def toggle_user(request,pk):
 u=auth(request,['admin'])
 if not u:return denied()
 target=get_object_or_404(User,pk=pk);target.is_active=not target.is_active;target.save();return JsonResponse({'is_active':target.is_active})
@csrf_exempt
def admin_job(request,pk):
 u=auth(request,['admin'])
 if not u:return denied()
 j=get_object_or_404(Job,pk=pk)
 if request.method=='DELETE':j.delete();return JsonResponse({'detail':'Job removed.'})
 j.active=body(request).get('active',not j.active);j.save();return JsonResponse({'active':j.active})
@csrf_exempt
def settings_view(request):
 u=auth(request,['admin'])
 if not u:return denied()
 s,_=SiteSetting.objects.get_or_create(pk=1)
 if request.method=='PATCH':
  d=body(request)
  previous_maintenance=s.maintenance_mode
  for f in ['portal_name','support_email','maintenance_mode','recent_jobs_days']:
   if f in d:setattr(s,f,d[f])
  s.save()
  if 'maintenance_mode' in d and s.maintenance_mode!=previous_maintenance:
   state='scheduled/active' if s.maintenance_mode else 'completed'
   notify('ZanHotel Ajira Portal maintenance update',f'System maintenance is now {state}. We will keep you informed of further changes.\n\nZanHotel Ajira Portal',User.objects.filter(is_active=True).values_list('email',flat=True))
 return JsonResponse({'portal_name':s.portal_name,'support_email':s.support_email,'maintenance_mode':s.maintenance_mode,'recent_jobs_days':s.recent_jobs_days})
