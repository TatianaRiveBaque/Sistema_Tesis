# Sistema de Diagnóstico de Cáncer de Mama

Una aplicación web completa para el diagnóstico de cáncer de mama usando machine learning.

## 🌐 DEMO EN VIVO

- **Frontend Demo:** [https://sistema-cancer-frontend.netlify.app](https://sistema-cancer-frontend.netlify.app)
- **API Backend:** [https://sistema-cancer-backend.onrender.com](https://sistema-cancer-backend.onrender.com)
- **Documentación API:** [https://sistema-cancer-backend.onrender.com/docs](https://sistema-cancer-backend.onrender.com/docs)

> ⚠️ **Actualiza estas URLs con las reales después del despliegue**

## 🚀 Despliegue Rápido

### Para Backend (Render):
1. Fork este repositorio
2. Ve a [render.com](https://render.com)
3. Crea nuevo Web Service
4. Conecta tu repo
5. Configura:
   ```
   Build Command: pip install -r backend/requirements.txt
   Start Command: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Para Frontend (Netlify):
1. Ve a [netlify.com](https://netlify.com)
2. Conecta tu repo
3. Configura:
   ```
   Publish directory: frontend
   ```
4. Deploy automático

## Características

- **Frontend**: HTML5 + CSS3 + JavaScript
- **Backend**: FastAPI con modelo de ML de TensorFlow
- **Contenedorizado**: Docker + Docker Compose
- **Gestión de Pacientes**: CRUD completo de pacientes
- **Predicción de Cáncer**: Análisis de imágenes médicas con IA

## Funcionalidades

### Frontend
- Búsqueda de pacientes por cédula
- Visualización de datos del paciente
- Carga y vista previa de imágenes médicas
- Diagnóstico con porcentaje de confianza
- Interfaz responsive y fácil de usar

### Backend
- API REST con FastAPI
- Endpoints para gestión de pacientes:
  - `GET /patients` - Listar todos los pacientes
  - `POST /patients` - Crear nuevo paciente
  - `GET /patients/{cedula}` - Obtener paciente por cédula
  - `DELETE /patients/{cedula}` - Eliminar paciente
  - `POST /patients/sample` - Crear paciente de muestra
- Endpoint de predicción:
  - `POST /predict` - Análisis de imagen con modelo de ML
- Documentación automática en `/docs`

## Uso Rápido

1. **Ejecutar la aplicación completa:**
   ```bash
   cd re-app-ml-cruz
   docker compose up
   ```

2. **Acceder a la aplicación:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Documentación API: http://localhost:8000/docs

3. **Usar la aplicación:**
   - Hacer clic en "Crear Paciente de Muestra" para datos de prueba
   - Buscar paciente por cédula (ej: 12345678 o 87654321)
   - Cargar imagen médica para análisis
   - Ver resultado del diagnóstico

## Estructura del Proyecto

```
re-app-ml-cruz/
├── backend/
│   ├── main.py                 # API FastAPI
│   ├── ml/
│   │   └── breast_cancer_detection_model_transfer.h5
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Aplicación React principal
│   │   └── App.css            # Estilos
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
└── docker-compose.yml         # Configuración completa
```

## Datos de Prueba

El sistema incluye pacientes de muestra:
- **Cédula**: 12345678 - María González
- **Cédula**: 87654321 - Ana Pérez (creado al hacer clic en el botón)

## Modelo de Machine Learning

- **Modelo**: Red neuronal convolucional con Transfer Learning
- **Entrada**: Imágenes 50x50 píxeles
- **Salida**: Predicción binaria (Cáncer/No Cáncer) con porcentaje de confianza
- **Formato**: TensorFlow/Keras (.h5)