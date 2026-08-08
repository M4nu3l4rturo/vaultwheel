#!/bin/bash
# Script de inicio para Zerops
# El codigo se despliega en /var/www, entonces backend/ esta en /var/www/backend/
# Corremos uvicorn como modulo desde /var/www

cd /var/www
exec uvicorn backend.main:app --host 0.0.0.0 --port 8000
