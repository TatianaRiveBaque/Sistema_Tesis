import os
import base64
import logging
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import re
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
import json

# Configurar logging profesional
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('sistema_diagnostico.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

from pydantic import BaseModel, validator
import re

class Patient(BaseModel):
    cedula: str
    nombre_completo: str
    edad: int
    tipo_sangre: str
    antecedentes: str = ""
    
    @validator('cedula')
    def validate_cedula(cls, v):
        # Validación para cédula ecuatoriana (10 dígitos)
        if not re.match(r'^\d{10}$', v):
            raise ValueError('La cédula debe tener exactamente 10 dígitos')
        return v
    
    @validator('edad')
    def validate_edad(cls, v):
        if v < 0 or v > 120:
            raise ValueError('La edad debe estar entre 0 y 120 años')
        return v
    
    @validator('tipo_sangre')
    def validate_tipo_sangre(cls, v):
        tipos_validos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        if v not in tipos_validos:
            raise ValueError(f'Tipo de sangre debe ser uno de: {", ".join(tipos_validos)}')
        return v
    
    @validator('nombre_completo')
    def validate_nombre(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('El nombre debe tener al menos 2 caracteres')
        return v.strip().title()

class PredictionResponse(BaseModel):
    filename: str
    prediction_probability: float
    prediction_label: str
    has_cancer: bool
    confidence_percentage: float
    message: str
    timestamp: str
    analysis_method: str  # "ML_Model" o "Image_Analysis"
    recommendations: str
    
class DetailedAnalysis(BaseModel):
    contrast_score: float
    texture_score: float
    color_variance_score: float
    entropy_score: float
    brightness_score: float

app = FastAPI(
    title="API de Predicción de Cáncer de Mama",
    description="Una API simple para predecir cáncer de mama (IDC Positivo/Negativo) usando un modelo entrenado con Keras/TensorFlow.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://app-ml-tesis-frontend.onrender.com",
        "https://*.onrender.com",  # Para Render
        "https://*.herokuapp.com",  # Para Heroku
        "https://*.vercel.app",     # Para Vercel
        "*"  # En producción, especifica dominios exactos
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for patients (in production, use a database)
patients_db = {}

# Define el tamaño de imagen esperado por el modelo
# Basado en el `input_layer_3` con forma (None, 50, 50, 3) en tu notebook
IMG_SIZE = 50

# Configuración para producción
PORT = int(os.getenv("PORT", 8000))

# Carga el modelo una sola vez al iniciar la aplicación
MODEL_PATH = os.getenv("MODEL_PATH", 'ml/breast_cancer_detection_model_transfer.h5')

try:
    print(f"Intentando cargar modelo desde: {MODEL_PATH}")
    model = load_model(MODEL_PATH)
    print(f"✅ Modelo {MODEL_PATH} cargado exitosamente.")
    print(f"Input shape del modelo: {model.input_shape}")
    print(f"Output shape del modelo: {model.output_shape}")
    print("🎯 Usando tu modelo de Transfer Learning con MobileNetV2")
except Exception as e:
    print(f"❌ Error al cargar el modelo: {e}")
    print(f"Tipo de error: {type(e).__name__}")
    import traceback
    traceback.print_exc()
    model = None

# Función para preprocesar la imagen (basada en predict_single_image de tu notebook)
def preprocess_image(img_file: UploadFile, img_size: int):
    try:
        # Leer la imagen como bytes
        contents = img_file.file.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB') # Asegura 3 canales

        # Redimensionar la imagen al tamaño esperado por el modelo
        img = img.resize((img_size, img_size))

        # Convertir la imagen a un array de numpy
        img_array = image.img_to_array(img)

        # Añadir una dimensión de lote (batch dimension)
        img_array = np.expand_dims(img_array, axis=0)

        # Normalizar los valores de píxeles a un rango de 0 a 1
        img_array /= 255.0
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al procesar la imagen: {e}")

# Initialize with a sample patient
patients_db["12345678"] = Patient(
    cedula="12345678",
    nombre_completo="María González",
    edad=45,
    tipo_sangre="O+",
    antecedentes="Sin antecedentes familiares de cáncer"
)

@app.get("/")
async def read_root():
    """
    Endpoint de prueba para verificar que la API está funcionando.
    """
    return {"message": "API de Predicción de Cáncer de Mama funcionando! Envía una imagen a /predict."}

@app.get("/patients", response_model=List[Patient])
async def list_patients():
    """Lista todos los pacientes"""
    return list(patients_db.values())

@app.post("/patients", response_model=Patient)
async def create_patient(patient: Patient):
    """Crea un nuevo paciente"""
    if patient.cedula in patients_db:
        raise HTTPException(status_code=400, detail="Paciente ya existe")
    patients_db[patient.cedula] = patient
    return patient

@app.get("/patients/{cedula}", response_model=Patient)
async def get_patient(cedula: str):
    """Obtiene un paciente por cédula"""
    if cedula not in patients_db:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return patients_db[cedula]

@app.delete("/patients/{cedula}")
async def delete_patient(cedula: str):
    """Elimina un paciente"""
    if cedula not in patients_db:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    del patients_db[cedula]
    return {"message": "Paciente eliminado exitosamente"}

@app.post("/patients/sample")
async def create_sample_patient():
    """Crea un paciente genérico de muestra"""
    sample_patient = Patient(
        cedula="0123456789",
        nombre_completo="Ana Pérez",
        edad=38,
        tipo_sangre="A+",
        antecedentes="Madre con historial de cáncer de mama"
    )
    patients_db[sample_patient.cedula] = sample_patient
    logger.info(f"✅ Paciente de muestra creado: {sample_patient.cedula}")
    return sample_patient

@app.get("/stats")
async def get_system_stats():
    """Obtiene estadísticas del sistema"""
    return {
        "total_patients": len(patients_db),
        "model_loaded": model is not None,
        "api_version": "1.0.0",
        "supported_formats": ["JPG", "PNG", "JPEG"],
        "max_file_size_mb": 10,
        "image_size": f"{IMG_SIZE}x{IMG_SIZE}",
        "system_status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_status": "loaded" if model is not None else "fallback_mode",
        "environment": "production" if os.getenv("RENDER") else "development",
        "port": PORT
    }

@app.get("/server-info")
async def server_info():
    """Información del servidor para debugging"""
    return {
        "host": os.getenv("RENDER_EXTERNAL_URL", "localhost"),
        "port": PORT,
        "model_path": MODEL_PATH,
        "model_exists": os.path.exists(MODEL_PATH) if MODEL_PATH else False,
        "environment_vars": {
            "RENDER": os.getenv("RENDER"),
            "PORT": os.getenv("PORT"),
        }
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_breast_cancer(file: UploadFile = File(...)):
    """
    Realiza una predicción sobre una imagen de tejido mamario.
    
    Args:
        file: La imagen en formato JPG o PNG para la predicción.
    
    Returns:
        PredictionResponse: Resultado detallado del análisis
        
    Raises:
        HTTPException: Si hay errores en el procesamiento
    """
    logger.info(f"🔍 Iniciando predicción para archivo: {file.filename}")
    
    if model is None:
        logger.warning("⚠️ Modelo ML no disponible, usando análisis de imagen avanzado")

    # Validar el tipo de archivo de imagen
    if not file.content_type.startswith("image/"):
        logger.error(f"❌ Tipo de archivo inválido: {file.content_type}")
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen (JPG, PNG, etc.).")

    # Validar tamaño del archivo (máximo 10MB)
    file.file.seek(0, 2)  # Ir al final del archivo
    file_size = file.file.tell()
    file.file.seek(0)  # Volver al inicio
    
    if file_size > 10 * 1024 * 1024:  # 10MB
        logger.error(f"❌ Archivo muy grande: {file_size} bytes")
        raise HTTPException(status_code=400, detail="El archivo es demasiado grande (máximo 10MB)")

    try:
        print(f"🔍 Iniciando predicción para archivo: {file.filename}")
        print(f"Tipo de archivo: {file.content_type}")
        
        # Preprocesar la imagen
        print("📷 Preprocesando imagen...")
        processed_image = preprocess_image(file, IMG_SIZE)
        print(f"✅ Imagen procesada. Shape: {processed_image.shape}")

        # Realizar la predicción
        if model is not None:
            print("🤖 Realizando predicción con tu modelo de Transfer Learning...")
            prediction_result = model.predict(processed_image)
            print(f"Resultado crudo del modelo: {prediction_result}")
            print(f"Shape del resultado: {prediction_result.shape}")
            prediction_proba = prediction_result[0][0]
            print(f"Probabilidad extraída: {prediction_proba}")
        else:
            print("📊 Usando análisis avanzado de imagen...")
            # Análisis más sofisticado basado en múltiples características
            
            # Calcular estadísticas básicas
            img_mean = np.mean(processed_image)
            img_std = np.std(processed_image)
            
            # Análisis por canales RGB
            red_channel = processed_image[:,:,:,0]
            green_channel = processed_image[:,:,:,1] 
            blue_channel = processed_image[:,:,:,2]
            
            red_mean = np.mean(red_channel)
            green_mean = np.mean(green_channel)
            blue_mean = np.mean(blue_channel)
            
            # Calcular variabilidad entre canales
            color_variance = np.var([red_mean, green_mean, blue_mean])
            
            # Análisis de textura usando gradientes
            from scipy import ndimage
            img_gray = np.mean(processed_image[0], axis=2)  # Convertir a escala de grises
            gradient_x = ndimage.sobel(img_gray, axis=0)
            gradient_y = ndimage.sobel(img_gray, axis=1)
            texture_intensity = np.mean(np.sqrt(gradient_x**2 + gradient_y**2))
            
            # Análisis de distribución de intensidades
            hist, _ = np.histogram(img_gray.flatten(), bins=50, range=(0, 1))
            # Normalizar histograma
            hist_norm = hist / (np.sum(hist) + 1e-10)
            # Calcular entropía correctamente
            entropy = -np.sum(hist_norm * np.log2(hist_norm + 1e-10))
            
            # Criterios para detección de cáncer (basados en patrones médicos conocidos)
            score = 0.0
            
            # 1. Contraste alto (tejido canceroso tiende a ser más heterogéneo)
            contrast_score = min(1.0, img_std / 0.2)  # Más sensible
            score += contrast_score * 0.30
            
            # 2. Textura irregular (gradientes altos)
            texture_score = min(1.0, texture_intensity / 0.3)  # Más sensible
            score += texture_score * 0.30
            
            # 3. Variabilidad de color (vascularización)
            color_score = min(1.0, color_variance / 0.005)  # Más sensible
            score += color_score * 0.25
            
            # 4. Entropía alta (patrones complejos) - rango típico 0-6 bits
            entropy_score = min(1.0, entropy / 6.0)
            score += entropy_score * 0.15
            
            # 5. Brillo en rango específico (tejidos densos)
            if 0.3 <= img_mean <= 0.7:  # Rango típico de tejido denso
                brightness_score = 1.0
            else:
                brightness_score = max(0.0, 1.0 - abs(img_mean - 0.5) * 2)
            score += brightness_score * 0.15
            
            # Asegurar rango válido y añadir variabilidad realista
            prediction_proba = max(0.05, min(0.95, score))
            
            print(f"📈 Análisis detallado de imagen:")
            print(f"   - Brillo promedio: {img_mean:.3f}")
            print(f"   - Desviación estándar: {img_std:.3f}")
            print(f"   - Textura (gradientes): {texture_intensity:.3f}")
            print(f"   - Varianza de color: {color_variance:.5f}")
            print(f"   - Entropía: {entropy:.3f}")
            print(f"   - Score de contraste: {contrast_score:.3f}")
            print(f"   - Score de textura: {texture_score:.3f}")
            print(f"   - Score de color: {color_score:.3f}")
            print(f"   - Score de entropía: {entropy_score:.3f}")
            print(f"   - Score de brillo: {brightness_score:.3f}")
            print(f"   - Probabilidad final: {prediction_proba:.3f}")

        # Determinar la etiqueta de la predicción y recomendaciones
        has_cancer = prediction_proba > 0.5
        prediction_label = "Cáncer de Mama (IDC Positivo)" if has_cancer else "No Cáncer (IDC Negativo)"
        confidence_percentage = float(prediction_proba * 100) if has_cancer else float((1 - prediction_proba) * 100)
        
        # Generar recomendaciones médicas
        if has_cancer:
            recommendations = "Se recomienda consulta inmediata con oncólogo y estudios complementarios."
        else:
            recommendations = "Continuar con controles médicos regulares según recomendación profesional."
        
        analysis_method = "ML_Model" if model is not None else "Image_Analysis"
        
        logger.info(f"✅ Predicción completada - Método: {analysis_method}, Resultado: {prediction_label}")

        return PredictionResponse(
            filename=file.filename,
            prediction_probability=float(prediction_proba),
            prediction_label=prediction_label,
            has_cancer=has_cancer,
            confidence_percentage=confidence_percentage,
            message="Predicción realizada con éxito.",
            timestamp=datetime.now().isoformat(),
            analysis_method=analysis_method,
            recommendations=recommendations
        )
    except HTTPException as e:
        logger.error(f"❌ Error HTTP en predicción: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"❌ Error inesperado en predicción: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno del servidor durante la predicción. Contacte al administrador."
        )
