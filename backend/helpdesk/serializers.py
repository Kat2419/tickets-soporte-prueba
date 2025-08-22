# Crea aquí tus serializers para Ticket y Comment, y si deseas uno específico para transición de estado.
from rest_framework import serializers
from .models import Ticket, Comment

PRIORITY = {"high", "medium", "low"}
STATE = {"new", "in_progress", "resolved", "closed"}
ALLOWED_TRANSITIONS = {
    "new": {"in_progress"},
    "in_progress": {"resolved", "new"}, 
    "resolved": {"closed"},
    "closed": set(), 
}

class TicketSerializer(serializers.ModelSerializer):

    created_at = serializers.DateTimeField(read_only=True) 

    class Meta:
        model = Ticket
        fields = "__all__"  
        read_only_fields = ("id", "created_at")

    def validate_priority(self, value):
        if value not in PRIORITY:
            raise serializers.ValidationError(f"priority debe ser uno de: {', '.join(PRIORITY)}")
        return value

    def validate_state(self, value):
        if value not in STATE:
            raise serializers.ValidationError(f"state debe ser uno de: {', '.join(STATE)}")
        return value

class CommentSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True) 
    ticket_id = serializers.IntegerField(write_only=True, required=True)
    ticket = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "created_at", "description", "ticket", "ticket_id")
        read_only_fields = ("id", "created_at", "ticket")

    def validate_ticket_id(self, value):
        if not Ticket.objects.filter(id=value).exists():
            raise serializers.ValidationError(f"El ticket con id {value} no existe.")
        return value

    def create(self, validated_data):
        ticket_id = validated_data.pop("ticket_id")
        ticket = Ticket.objects.get(id=ticket_id)
        return Comment.objects.create(ticket=ticket, **validated_data)

class TransitionSerializer(serializers.Serializer):
    ticket_id = serializers.IntegerField()
    state = serializers.CharField()

    def validate_ticket_id(self, value):
        if not Ticket.objects.filter(id=value).exists():
            raise serializers.ValidationError("El ticket no existe.")
        return value

    def validate_state(self, value):
        if value not in STATE:
            raise serializers.ValidationError("Estado inválido.")
        return value

    def validate(self, attrs):
        ticket_id = attrs.get("ticket_id")
        new_state = attrs.get("state")

        try:
            ticket = Ticket.objects.get(id=ticket_id)
        except Ticket.DoesNotExist:
            raise serializers.ValidationError({"ticket_id": "El ticket no existe."})

        current_state = ticket.state

        if new_state == current_state:
            return attrs

        allowed = ALLOWED_TRANSITIONS.get(current_state, set())
        if new_state not in allowed:
            raise serializers.ValidationError({
                "state": f"No se puede pasar de '{current_state}' a '{new_state}'."
            })

        return attrs