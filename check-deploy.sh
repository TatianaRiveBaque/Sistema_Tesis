#!/bin/bash

echo "🔍 VERIFICACIÓN PRE-DESPLIEGUE"
echo "=============================="

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📋 Verificando archivos críticos...${NC}"

# Verificar estructura del proyecto
if [ -f "backend/main.py" ]; then
    echo -e "${GREEN}✅ main.py encontrado${NC}"
else
    echo -e "${RED}❌ main.py NO encontrado${NC}"
fi

if [ -f "backend/requirements.txt" ]; then
    echo -e "${GREEN}✅ requirements.txt encontrado${NC}"
else
    echo -e "${RED}❌ requirements.txt NO encontrado${NC}"
fi

if [ -f "frontend/index.html" ]; then
    echo -e "${GREEN}✅ index.html encontrado${NC}"
else
    echo -e "${RED}❌ index.html NO encontrado${NC}"
fi

if [ -f "frontend/config.js" ]; then
    echo -e "${GREEN}✅ config.js encontrado${NC}"
else
    echo -e "${RED}❌ config.js NO encontrado${NC}"
fi

echo ""
echo -e "${YELLOW}📊 Información del proyecto:${NC}"
echo "   🐍 Archivos Python: $(find . -name "*.py" 2>/dev/null | wc -l)"
echo "   🌐 Archivos HTML: $(find . -name "*.html" 2>/dev/null | wc -l)"
echo "   📜 Archivos JS: $(find . -name "*.js" 2>/dev/null | wc -l)"

echo ""
echo -e "${YELLOW}🔗 URLs que configurar en Render:${NC}"
echo "   📁 Root Directory: backend"
echo "   🔨 Build Command: pip install -r requirements.txt"
echo "   ▶️  Start Command: uvicorn main:app --host 0.0.0.0 --port \$PORT"

echo ""
echo -e "${GREEN}🚀 ¡LISTO PARA DESPLEGAR!${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Ve a render.com"
echo "2. Conecta tu repositorio GitHub"
echo "3. Usa la configuración de arriba"
echo "4. ¡Deploy automático!"

echo ""
echo -e "${YELLOW}🎓 Para tu tesis tendrás:${NC}"
echo "   🌐 Sistema en internet real"
echo "   📚 API documentada automáticamente"
echo "   💚 Health checks profesionales"
echo "   📊 Métricas del sistema"
echo "   🔒 HTTPS automático"
