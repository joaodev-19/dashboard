from django.shortcuts import render, redirect
from rest_framework import viewsets
from .models import Task
from .serializer import TaskSerializer
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.all()
        status = self.request.query_params.get('status')

        if status:
            queryset = queryset.filter(status=status)

        return queryset

def dashboard_view(request):
    return render(request, 'dashboard/index.html')