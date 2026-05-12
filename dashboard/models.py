from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class Task(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PE', _('Pending')
        IN_PROGRESS = 'IP', _('In Progress')
        DONE = 'DN', _('Done')
    
    title = models.CharField(max_length=100, blank=False, null=False)
    description = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(
        max_length=2,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField(blank=False, null=False)

    def __str__(self):
        return self.title