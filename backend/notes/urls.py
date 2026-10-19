from django.urls import path
from .views import create_note, users_list

urlpatterns = [path("users/", users_list, name="users-list"), path("notes/", create_note, name="notes-create")]
