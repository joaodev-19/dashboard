from rest_framework import viewsets
from .models import Task
from .serializer import TaskSerializer
from django.shortcuts import render

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.all()
        status = self.request.query_params.get('status')

        if status:
            queryset = queryset.filter(status=status)

        return queryset

def home_view(request):
    return render(request, 'dashboard/index.html')