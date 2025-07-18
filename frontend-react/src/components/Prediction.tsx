import React, { useState } from 'react';
import { Patient, PredictionResult, predictionAPI } from '../services/api';

interface PredictionProps {
  patient: Patient;
  onBack: () => void;
}

const Prediction: React.FC<PredictionProps> = ({ patient, onBack }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor seleccione un archivo de imagen válido');
    }
  };

  const handleUploadAndPredict = async () => {
    if (!selectedFile) {
      alert('Por favor seleccione una imagen primero');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await predictionAPI.predict(selectedFile);
      setPrediction(response.data);
    } catch (err: any) {
      console.error('Prediction error:', err);
      setError(err.response?.data?.detail || 'Error en la predicción');
    } finally {
      setLoading(false);
    }
  };

  const nombreCompleto = `${patient.nombre} ${patient.apellido_paterno} ${patient.apellido_materno}`;

  return (
    <div className="dashboard-section">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <h1>Análisis de Imagen - {nombreCompleto}</h1>
          </div>
          <div className="header-actions">
            <button onClick={onBack} className="btn btn-outline">
              Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="patient-grid">
          <div className="card">
            <div className="card-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <h3>Imagen Médica</h3>
            </div>
            <div className="card-content">
              <div className="image-upload">
                <div className="image-container">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Imagen seleccionada" style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px'}} />
                  ) : (
                    <div className="image-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                      <p>Seleccionar imagen</p>
                    </div>
                  )}
                </div>
                <div className="upload-controls">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{display: 'none'}}
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="btn btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17,8 12,3 7,8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Cargar Imagen
                  </label>
                  <button 
                    onClick={handleUploadAndPredict}
                    className="btn btn-primary"
                    disabled={!selectedFile || loading}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16,6 12,2 8,6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    {loading ? 'Analizando...' : 'Analizar'}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="error" style={{marginTop: '1rem'}}>
                  {error}
                </div>
              )}

              {prediction && (
                <div style={{marginTop: '1rem'}}>
                  <div className="card-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11H1l6-6 6 6"/>
                      <path d="M9 17l3 3 3-3"/>
                      <path d="M22 18.5c0 2.485 0 4.5-6 4.5s-6-2.015-6-4.5S10.515 14 16 14s6 2.015 6 4.5"/>
                      <circle cx="16" cy="18.5" r="2.5"/>
                    </svg>
                    <h3>Resultado del Análisis</h3>
                  </div>
                  <div className="card-content">
                    <div className={`prediction-card ${prediction.has_cancer ? 'positive' : 'negative'}`}>
                      <div className="prediction-header">
                        <h4>{prediction.prediction_label}</h4>
                        <div className="confidence">
                          {prediction.confidence_percentage.toFixed(2)}% de confianza
                        </div>
                      </div>
                      <div className="prediction-details">
                        <div className="prediction-detail">
                          <label>Archivo:</label>
                          <span>{prediction.filename}</span>
                        </div>
                        <div className="prediction-detail">
                          <label>Probabilidad:</label>
                          <span>{(prediction.prediction_probability * 100).toFixed(2)}%</span>
                        </div>
                        {prediction.has_cancer && prediction.etapa_cancer && (
                          <div className="prediction-detail">
                            <label>Etapa del Cáncer:</label>
                            <span>{prediction.etapa_cancer}</span>
                          </div>
                        )}
                        <div className="prediction-detail">
                          <label>Mensaje:</label>
                          <span>{prediction.message}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <h3>Información del Paciente</h3>
            </div>
            <div className="card-content">
              <div className="patient-details">
                <div className="patient-detail">
                  <label>Nombre Completo:</label>
                  <span>{nombreCompleto}</span>
                </div>
                <div className="patient-detail">
                  <label>Documento:</label>
                  <span>{patient.tipo_documento}: {patient.numero_documento}</span>
                </div>
                <div className="patient-detail">
                  <label>Edad:</label>
                  <span>{patient.edad || 'N/A'} años</span>
                </div>
                <div className="patient-detail">
                  <label>Sexo:</label>
                  <span>{patient.sexo}</span>
                </div>
                <div className="patient-detail">
                  <label>Fecha de Nacimiento:</label>
                  <span>{patient.fecha_nacimiento}</span>
                </div>
                <div className="patient-detail">
                  <label>Estado Civil:</label>
                  <span>{patient.estado_civil}</span>
                </div>
                <div className="patient-detail">
                  <label>Teléfono:</label>
                  <span>{patient.telefono || 'No especificado'}</span>
                </div>
                <div className="patient-detail">
                  <label>Email:</label>
                  <span>{patient.email || 'No especificado'}</span>
                </div>
                <div className="patient-detail">
                  <label>Ocupación:</label>
                  <span>{patient.ocupacion || 'No especificado'}</span>
                </div>
                <div className="patient-detail">
                  <label>Alergias:</label>
                  <span>{patient.alergias || 'Ninguna conocida'}</span>
                </div>
                <div className="patient-detail">
                  <label>Antecedentes Familiares:</label>
                  <span>{patient.antecedentes_familiares_cancer || 'Sin antecedentes conocidos'}</span>
                </div>
                <div className="patient-detail">
                  <label>Último Examen:</label>
                  <span>{patient.fecha_ultimo_examen || 'No especificado'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Prediction;
