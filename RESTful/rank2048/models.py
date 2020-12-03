from django.db import models


# Create your models here.
class Scores(models.Model):
    ip = models.CharField(primary_key=True, max_length=15)
    name = models.CharField(max_length=16)
    type = models.CharField(max_length=10)
    score = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'scores'
        unique_together = (('ip', 'name', 'type'),)


