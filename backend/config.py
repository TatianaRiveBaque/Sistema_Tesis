"""
Configuración del Sistema de Diagnóstico de Cáncer de Mama
"""
import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    # Configuración de la aplicación
    app_name: str = "Sistema de Diagnóstico de Cáncer de Mama"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Configuración del modelo
    model_path: str = "ml/breast_cancer_detection_model_transfer.h5"
    img_size: int = 50
    
    # Configuración de archivos
    max_file_size_mb: int = 10
    allowed_extensions: list = ["jpg", "jpeg", "png"]
    
    # Configuración de CORS
    cors_origins: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://app-ml-tesis-frontend.onrender.com"
    ]
    
    # Configuración de logging
    log_level: str = "INFO"
    log_file: str = "sistema_diagnostico.log"
    
    # Configuración de base de datos (para futuras mejoras)
    database_url: str = "sqlite:///./pacientes.db"
    
    class Config:
        env_file = ".env"

# Instancia global de configuración
settings = Settings()
