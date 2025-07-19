#!/bin/bash

echo "🚀 SCRIPT DE DESPLIEGUE RÁPIDO"
echo "================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Verificando archivos necesarios...${NC}"

# Verificar archivos críticos
if [ ! -f "backend/main.py" ]; then
    echo -e "${RED}❌ Error: backend/main.py no encontrado${NC}"
    exit 1
fi

if [ ! -f "backend/requirements.txt" ]; then
    echo -e "${RED}❌ Error: backend/requirements.txt no encontrado${NC}"
    exit 1
fi

if [ ! -f "frontend/index.html" ]; then
    echo -e "${RED}❌ Error: frontend/index.html no encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivos principales verificados${NC}"

# Verificar Git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️ Inicializando repositorio Git...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Sistema de Diagnóstico"
fi

echo -e "${BLUE}📊 Estadísticas del proyecto:${NC}"
echo "   - Archivos Python: $(find . -name "*.py" | wc -l)"
echo "   - Archivos HTML: $(find . -name "*.html" | wc -l)"
echo "   - Archivos JS: $(find . -name "*.js" | wc -l)"
echo "   - Archivos CSS: $(find . -name "*.css" | wc -l)"

# Mostrar URLs importantes
echo -e "${GREEN}🌐 URLs importantes para tu tesis:${NC}"
echo "   📖 Documentación: https://tu-backend.onrender.com/docs"
echo "   💚 Health Check: https://tu-backend.onrender.com/health"
echo "   📊 Estadísticas: https://tu-backend.onrender.com/stats"
echo "   🌍 Demo en vivo: https://tu-frontend.netlify.app"

echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo "   1. Subir código a GitHub"
echo "   2. Conectar Render para el backend"
echo "   3. Conectar Netlify para el frontend"
echo "   4. Actualizar URLs en config.js"
echo "   5. ¡Probar tu aplicación en vivo!"

echo -e "${GREEN}🎓 ¡Tu sistema está listo para la defensa de tesis!${NC}"
