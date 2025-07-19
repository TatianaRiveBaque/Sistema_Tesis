#!/bin/bash
# Script de inicio para producción

echo "🚀 Iniciando Sistema de Diagnóstico de Cáncer de Mama..."

# Verificar que existe el archivo principal
if [ ! -f "main.py" ]; then
    echo "❌ Error: main.py no encontrado"
    exit 1
fi

# Verificar modelo (opcional)
if [ -f "ml/breast_cancer_detection_model_transfer.h5" ]; then
    echo "✅ Modelo ML encontrado"
else
    echo "⚠️  Modelo ML no encontrado - usando modo fallback"
fi

# Iniciar servidor
echo "🌐 Iniciando servidor en puerto $PORT..."
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
