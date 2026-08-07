from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("portal", "0001_initial")]
    operations = [
        migrations.AddField(
            model_name="application",
            name="applicant_note",
            field=models.TextField(blank=True),
        )
    ]
