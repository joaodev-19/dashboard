from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    cpf = models.CharField(max_length=14, blank=False, null=False)
    password = models.CharField(max_length=30, blank=False, null=False)

    