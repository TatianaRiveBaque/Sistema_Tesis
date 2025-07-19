# 🚀 Guía de Despliegue - Sistema de Diagnóstico de Cáncer de Mama

## 📋 Opciones de Despliegue

### 🌟 OPCIÓN 1: Render (Recomendado - Gratuito)

**Ventajas:**
- ✅ Gratuito para proyectos académicos
- ✅ HTTPS automático
- ✅ Despliegue automático desde GitHub
- ✅ Logs en tiempo real
- ✅ Perfecto para tesis universitarias

**Pasos:**

1. **Preparar el repositorio:**
   ```bash
   # Asegúrate de que tu código esté en GitHub
   git add .
   git commit -m "Preparar para despliegue en producción"
   git push origin main
   ```

2. **Configurar Render:**
   - Ve a [render.com](https://render.com)
   - Conecta tu cuenta de GitHub
   - Crea nuevo "Web Service"
   - Selecciona tu repositorio `Sistema_Tesis`

3. **Configuración del servicio:**
   ```
   Name: sistema-diagnostico-cancer-mama
   Environment: Python 3
   Build Command: pip install -r backend/requirements.txt
   Start Command: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

4. **Variables de entorno:**
   ```
   PORT=8000
   MODEL_PATH=ml/breast_cancer_detection_model_transfer.h5
   PYTHON_VERSION=3.9.16
   ```

### 🌐 OPCIÓN 2: Railway (Alternativa Gratuita)

**Pasos:**
1. Ve a [railway.app](https://railway.app)
2. Conecta GitHub
3. Deploy desde repositorio
4. Configuración automática

### ☁️ OPCIÓN 3: Heroku (Con limitaciones gratuitas)

**Pasos:**
1. Instalar Heroku CLI
2. Crear aplicación:
   ```bash
   heroku create tu-app-cancer-diagnostico
   git push heroku main
   ```

### 🐳 OPCIÓN 4: VPS con Docker (Más control)

Si tienes un servidor propio o VPS:

```bash
# En tu servidor
git clone https://github.com/TatianaRiveBaque/Sistema_Tesis.git
cd Sistema_Tesis
docker-compose up -d
```

## 🔧 Configuración del Frontend

Para que el frontend se conecte al backend en producción:

### Actualizar script.js:

```javascript
// En lugar de localhost, usar la URL de producción
const API_BASE_URL = 'https://tu-app-backend.onrender.com';

// Ejemplo:
const API_BASE_URL = 'https://sistema-diagnostico-cancer.onrender.com';
```

### Frontend en Netlify/Vercel:

1. **Netlify:**
   - Conecta el repositorio
   - Configura build: `Frontend` folder
   - Deploy automático

2. **Vercel:**
   - Conecta GitHub
   - Selecciona carpeta `frontend`
   - Deploy

## 🌍 URLs Finales Esperadas

Después del despliegue tendrás:

```
Backend API: https://sistema-diagnostico-backend.onrender.com
Frontend:    https://sistema-diagnostico-frontend.netlify.app
Docs API:    https://sistema-diagnostico-backend.onrender.com/docs
```

## 🔍 Verificación Post-Despliegue

### 1. Probar endpoints:
```bash
# Health check
curl https://tu-backend-url.onrender.com/health

# Stats del sistema
curl https://tu-backend-url.onrender.com/stats

# Documentación
# Visita: https://tu-backend-url.onrender.com/docs
```

### 2. Logs del servidor:
- En Render: Dashboard → Service → Logs
- Monitorear errores de inicio

### 3. Testing completo:
- Crear paciente
- Subir imagen
- Verificar predicción

## ⚡ Optimizaciones para Producción

### 1. Comprimir modelo ML:
```python
# Si el modelo es muy grande, considera comprimir
import gzip
import pickle

# Comprimir modelo para reducir tamaño
```

### 2. Variables de entorno:
```bash
# .env para producción
DEBUG=False
LOG_LEVEL=INFO
CORS_ORIGINS=https://tu-frontend.netlify.app
```

### 3. Configurar dominio personalizado:
- En Render: Settings → Custom Domains
- Agregar tu dominio propio

## 🛠️ Troubleshooting Común

### Problema: Modelo muy grande
**Solución:** Usar Git LFS o almacenamiento externo
```bash
git lfs track "*.h5"
git add .gitattributes
git add ml/breast_cancer_detection_model_transfer.h5
git commit -m "Add model with LFS"
```

### Problema: Timeout en inicio
**Solución:** Aumentar timeout en configuración del servicio

### Problema: CORS errors
**Solución:** Verificar URLs en CORS middleware

### Problema: Logs no aparecen
**Solución:** Verificar configuración de logging

## 📊 Monitoreo y Métricas

### UptimeRobot (Gratuito):
- Monitorear disponibilidad
- Alertas por email
- Estadísticas de uptime

### Google Analytics:
- Agregar al frontend
- Monitorear uso real

## 🎯 Para la Defensa de Tesis

**URLs que debes tener listas:**

1. **Demo en vivo:** `https://tu-app.netlify.app`
2. **API Docs:** `https://tu-backend.onrender.com/docs`
3. **Health Check:** `https://tu-backend.onrender.com/health`
4. **Código fuente:** `https://github.com/TatianaRiveBaque/Sistema_Tesis`

**Funcionalidades a demostrar:**
- ✅ Sistema funcionando en internet
- ✅ Gestión de pacientes
- ✅ Análisis de imágenes en tiempo real
- ✅ Respuestas médicas apropiadas
- ✅ Logs y monitoreo
- ✅ Documentación automática

## 💡 Comandos Útiles

```bash
# Verificar estado del despliegue
curl -s https://tu-backend.onrender.com/health | jq

# Test completo de API
curl -X POST https://tu-backend.onrender.com/patients \
  -H "Content-Type: application/json" \
  -d '{"cedula":"1234567890","nombre_completo":"Test User","edad":30,"tipo_sangre":"O+","antecedentes":"Ninguno"}'

# Logs en tiempo real (si tienes acceso SSH)
tail -f sistema_diagnostico.log
```

¡Con esta configuración tendrás tu sistema corriendo en internet y listo para la defensa de tesis! 🎓
