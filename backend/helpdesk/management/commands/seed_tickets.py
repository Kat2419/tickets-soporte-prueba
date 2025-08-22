from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Crea datos de ejemplo para tickets (implementa según tus modelos)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Seed de tickets: implementa según tus modelos."))
