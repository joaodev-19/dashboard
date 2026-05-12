from rest_framework import serializers
from django.utils import timezone
from .models import Task

class TaskSerializer(serializers.ModelSerializer):

    # Campo calculado
    urgency = serializers.SerializerMethodField()
    time_since_creation = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status',
            'created_at', 'due_date', 'urgency', 'time_since_creation'
        ]

    def get_urgency(self, obj):
        remaining_time = obj.due_date - timezone.now()
        days = remaining_time.days

        if (days < 1):
            return 'CRITICAL'
        elif (days <= 3):
            return 'HIGH'
        elif (days <= 7):
            return 'MEDIUM'
        return 'LOW'
    
    def get_time_since_creation(self, obj):
        diff = timezone.now() - obj.created_at
        return f"{diff.days} dias atrás" if diff.days > 0 else "Hoje"