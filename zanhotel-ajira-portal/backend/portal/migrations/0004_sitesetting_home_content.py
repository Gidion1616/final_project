from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("portal", "0003_recent_jobs_three_days")]
    operations = [
        migrations.AddField(
            model_name="sitesetting",
            name="hero_eyebrow",
            field=models.CharField(
                default="Zanzibar's hospitality careers platform", max_length=160
            ),
        ),
        migrations.AddField(
            model_name="sitesetting",
            name="hero_title",
            field=models.CharField(
                default="Your next opportunity starts here.", max_length=200
            ),
        ),
        migrations.AddField(
            model_name="sitesetting",
            name="hero_subtitle",
            field=models.TextField(
                default="Discover verified hotel vacancies across Zanzibar. Build your profile once, apply with confidence."
            ),
        ),
        migrations.AddField(
            model_name="sitesetting",
            name="hero_image",
            field=models.ImageField(blank=True, upload_to="site/"),
        ),
    ]
