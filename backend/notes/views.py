from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import NoteCreateSerializer, UserSerializer

User = get_user_model()


@api_view(["GET"])
def users_list(request):
    users = User.objects.order_by("id")
    return Response(UserSerializer(users, many=True).data)


@api_view(["POST"])
def create_note(request):
    serializer = NoteCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    note = serializer.save()
    return Response(
        {"message": "Заметка создана", "user_id": note.user_id, "text": note.text},
        status=status.HTTP_201_CREATED,
    )
