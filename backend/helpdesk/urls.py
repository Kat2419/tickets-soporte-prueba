from django.urls import path

from . import views

urlpatterns = [

    path("tickets/", views.list_tickets, name="list-tickets"),
    path("ticket/<int:ticket_id>/", views.ticket_details, name="ticket-details"),
    path("ticket/create", views.create_ticket, name="create-ticket"),
    path("tickets/update-status", views.update_ticket_status, name="update-ticket-status"),
    
    
    path("comments/<int:ticket_id>/", views.list_comments_by_ticket, name="list-comments-by-ticket"),
    path("comments/create", views.create_comment, name="create-comment"),
]
