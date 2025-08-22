from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

def health(_):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health),
    path("api/", include("helpdesk.urls")),
]
