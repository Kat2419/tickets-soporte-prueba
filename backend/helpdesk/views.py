# Implementa aquí tus ViewSets y endpoints (listar/crear tickets, transición, comentarios).
# Puedes empezar con un endpoint placeholder si lo deseas.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TicketSerializer,CommentSerializer
from rest_framework import status
from .models import Ticket, Comment

STATE = {"new", "in_progress", "resolved", "closed"}

ALLOWED_TRANSITIONS = {
    "new": {"in_progress"},
    "in_progress": {"resolved", "new"}, 
    "resolved": {"closed"},
    "closed": set(), 
}

@api_view(["GET"])
def list_tickets(request):
    tickets = Ticket.objects.all() 
    serializer = TicketSerializer(tickets, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def ticket_details(request, ticket_id: int):
    try:
        ticket = Ticket.objects.get(id=ticket_id)
    except Ticket.DoesNotExist:
        return Response(
            {"error": f"Ticket con id {ticket_id} no existe"},
            status=404
        )
    serializer = TicketSerializer(ticket)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def create_ticket(request):
    serializer = TicketSerializer(data=request.data)
    if serializer.is_valid():
        ticket = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PATCH"])
def update_ticket_status(request):
    serializer = TransitionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    ticket_id = serializer.validated_data["ticket_id"]
    new_state = serializer.validated_data["state"]
    ticket = Ticket.objects.get(id=ticket_id)
    ticket.state = new_state
    ticket.save()
    return Response(TicketSerializer(ticket).data, status=status.HTTP_200_OK)

@api_view(["GET"])
def list_comments_by_ticket(request, ticket_id: int):
    if not Ticket.objects.filter(id=ticket_id).exists():
        return Response(
            {"error": f"Ticket con id {ticket_id} no existe"},
            status=status.HTTP_404_NOT_FOUND
        )
    comments = Comment.objects.filter(ticket_id=ticket_id).order_by("created_at")
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
def create_comment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        comment = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)