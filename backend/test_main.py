"""
Tests para el Sistema de Diagnóstico de Cáncer de Mama
"""
import pytest
from fastapi.testclient import TestClient
from main import app, Patient
import io
from PIL import Image

client = TestClient(app)

def test_read_root():
    """Test del endpoint raíz"""
    response = client.get("/")
    assert response.status_code == 200
    assert "API de Predicción de Cáncer de Mama" in response.json()["message"]

def test_health_check():
    """Test del health check"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_stats():
    """Test de estadísticas del sistema"""
    response = client.get("/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_patients" in data
    assert "system_status" in data

def test_create_patient():
    """Test de creación de paciente"""
    patient_data = {
        "cedula": "1234567890",
        "nombre_completo": "Test Patient",
        "edad": 30,
        "tipo_sangre": "O+",
        "antecedentes": "Ninguno"
    }
    response = client.post("/patients", json=patient_data)
    assert response.status_code == 200
    assert response.json()["cedula"] == "1234567890"

def test_get_patient():
    """Test de obtención de paciente"""
    # Primero crear un paciente
    patient_data = {
        "cedula": "9876543210",
        "nombre_completo": "Test Patient 2",
        "edad": 25,
        "tipo_sangre": "A+",
        "antecedentes": "Ninguno"
    }
    client.post("/patients", json=patient_data)
    
    # Luego obtenerlo
    response = client.get("/patients/9876543210")
    assert response.status_code == 200
    assert response.json()["nombre_completo"] == "Test Patient 2"

def test_invalid_cedula():
    """Test de validación de cédula inválida"""
    patient_data = {
        "cedula": "123",  # Cédula muy corta
        "nombre_completo": "Test Patient",
        "edad": 30,
        "tipo_sangre": "O+",
        "antecedentes": "Ninguno"
    }
    response = client.post("/patients", json=patient_data)
    assert response.status_code == 422  # Error de validación

def test_predict_invalid_file():
    """Test de predicción con archivo inválido"""
    # Crear un archivo que no es imagen
    files = {"file": ("test.txt", "not an image", "text/plain")}
    response = client.post("/predict", files=files)
    assert response.status_code == 400

def create_test_image():
    """Crear una imagen de prueba"""
    img = Image.new('RGB', (50, 50), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def test_predict_valid_image():
    """Test de predicción con imagen válida"""
    img_bytes = create_test_image()
    files = {"file": ("test.png", img_bytes, "image/png")}
    response = client.post("/predict", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "prediction_probability" in data
    assert "confidence_percentage" in data
    assert "analysis_method" in data

if __name__ == "__main__":
    pytest.main([__file__])
