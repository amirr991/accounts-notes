from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Note

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")


class NoteCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source="user", queryset=User.objects.all())

    class Meta:
        model = Note
        fields = ("user_id", "text")

    def validate_text(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Введите текст заметки.")
        return value
