from django.db import models


class Ticket(models.Model):
    created_at = models.DateTimeField(auto_now_add=True) 
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=120)
    priority = models.CharField(max_length=15)  # 'high', 'medium', 'low'
    reporter_name = models.CharField(max_length=35)
    email = models.CharField(max_length=30)
    state = models.CharField(max_length=30)  # 'new', 'in_progress', 'resolved', 'closed'

    def __str__(self):
        return self.title

class Comment(models.Model):
    created_at = models.DateTimeField(auto_now_add=True) 
    ticket = models.ForeignKey(
        Ticket,                
        on_delete=models.CASCADE, 
        related_name="comments"   
    )
    description = models.CharField(max_length=160)

    def __str__(self):
        return f"Comment for {self.ticket.title}, {self.description}"