from django.db import migrations, models


def set_recent_window_to_three_days(apps, schema_editor):
    """
    EN: Update existing SiteSetting rows so Home immediately uses three days.
    SW: Sasisha SiteSetting zilizopo ili Home ianze kutumia siku tatu mara moja.
    EN: This data migration changes only the recent-jobs display window.
    SW: Migration hii inabadilisha muda wa kuonekana kwa ajira mpya pekee.
    EN/SW: Jobs and applications themselves are not deleted / Ajira hazifutwi.
    """
    SiteSetting = apps.get_model("portal", "SiteSetting")
    SiteSetting.objects.all().update(recent_jobs_days=3)


class Migration(migrations.Migration):
    dependencies = [("portal", "0002_application_applicant_note")]

    operations = [
        migrations.AlterField(
            model_name="sitesetting",
            name="recent_jobs_days",
            field=models.PositiveIntegerField(default=3),
        ),
        migrations.RunPython(
            set_recent_window_to_three_days,
            migrations.RunPython.noop,
        ),
    ]
