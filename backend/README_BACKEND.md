# Backend (Django + DRF) – Esqueleto mínimo

## Requisitos
- Python 3.10+ recomendado
- (Opcional) Entorno virtual

## Instalación
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata tickets.json # Ejecutar semilla/fixtures para poblar la base de datos
python manage.py loaddata comments.json # Ejecutar semilla/fixtures para poblar la base de datos 
python manage.py runserver
```
- API base en: http://127.0.0.1:8000/
- Salud: http://127.0.0.1:8000/health/

## Notas
- Este esqueleto incluye CORS abierto para desarrollo.
- La app `helpdesk` está creada vacía para que implementes modelos/serializers/vistas.
