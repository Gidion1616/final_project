from django.db import migrations, models


# HOTEL STAR DATABASE MIGRATION / MABADILIKO YA DATABASE YA NYOTA
# EN: This migration adds the Ministry-controlled classification to existing hotels.
# SW: Migration hii inaongeza daraja linalodhibitiwa na Wizara kwa hoteli zilizopo.
# EN: Existing hotel records receive zero, meaning they remain unclassified initially.
# SW: Hoteli za zamani hupata sifuri, yaani hazijapewa daraja mwanzoni.
# EN/SW: Running migrate updates the schema without deleting existing hotel information.
class Migration(migrations.Migration):
    dependencies = [("portal", "0004_sitesetting_home_content")]

    operations = [
        migrations.AddField(
            model_name="hotel",
            name="star_rating",
            field=models.PositiveSmallIntegerField(
                choices=[
                    (0, "Unclassified"),
                    (1, "1 Star"),
                    (2, "2 Stars"),
                    (3, "3 Stars"),
                    (4, "4 Stars"),
                    (5, "5 Stars"),
                ],
                default=0,
            ),
        )
    ]
