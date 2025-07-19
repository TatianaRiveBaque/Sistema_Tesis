// Variables globales
let currentPatient = null;
let selectedFile = null;

// Configuración automática de URL según entorno
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost 
    ? 'http://localhost:8000'  // Desarrollo local
    : 'https://sistema-diagnostico-backend.onrender.com'; // Producción (actualiza con tu URL real)

console.log('🌐 Conectando a API:', API_URL);
// Función para buscar paciente
async function searchPatient() {
    const cedula = document.getElementById('cedula-input').value.trim();
    
    if (!cedula) {
        alert('Por favor ingrese un número de cédula');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/patients/${cedula}`);
        
        if (response.ok) {
            const patient = await response.json();
            currentPatient = patient;
            showPatientSection();
            displayPatientInfo(patient);
        } else {
            alert('Paciente no encontrado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

// Función para crear paciente de muestra
async function createSamplePatient() {
    try {
        const response = await fetch(`${API_URL}/patients/sample`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const patient = await response.json();
            document.getElementById('cedula-input').value = patient.cedula;
            alert(`Paciente de muestra creado con cédula: ${patient.cedula}`);
        } else {
            alert('Error al crear paciente de muestra');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

// Función para mostrar la sección del paciente
function showPatientSection() {
    document.getElementById('search-section').classList.add('hidden');
    document.getElementById('patient-section').classList.remove('hidden');
}

// Función para mostrar información del paciente
function displayPatientInfo(patient) {
    const patientInfo = document.getElementById('patient-info');
    patientInfo.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Cédula:</div>
            <div class="detail-value">${patient.cedula}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Nombre:</div>
            <div class="detail-value">${patient.nombre_completo}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Edad:</div>
            <div class="detail-value">${patient.edad} años</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Tipo Sangre:</div>
            <div class="detail-value">${patient.tipo_sangre}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Antecedentes:</div>
            <div class="detail-value">
                <textarea readonly rows="3">${patient.antecedentes}</textarea>
            </div>
        </div>
    `;
}

// Función para manejar selección de archivo
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (file) {
        selectedFile = file;
        
        // Mostrar vista previa
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageContainer = document.getElementById('image-container');
            imageContainer.innerHTML = `<img src="${e.target.result}" alt="Imagen seleccionada">`;
        };
        reader.readAsDataURL(file);
        
        // Habilitar botón de subir
        document.getElementById('upload-btn').disabled = false;
    }
}

// Función para subir imagen y predecir
async function uploadAndPredict() {
    if (!selectedFile) {
        alert('Por favor seleccione una imagen');
        return;
    }

    // Mostrar loading
    document.getElementById('loading').classList.remove('hidden');
    
    // Cambiar texto del botón
    const uploadBtn = document.getElementById('upload-btn');
    const originalText = uploadBtn.innerHTML;
    uploadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Analizando...
    `;
    uploadBtn.disabled = true;

    try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            displayPrediction(result);
        } else {
            alert('Error en la predicción');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    } finally {
        // Ocultar loading
        document.getElementById('loading').classList.add('hidden');
        
        // Restaurar botón
        uploadBtn.innerHTML = originalText;
        uploadBtn.disabled = false;
    }
}

// Función para mostrar predicción
function displayPrediction(result) {
    const predictionSection = document.getElementById('prediction-section');
    const predictionResult = document.getElementById('prediction-result');
    
    const statusClass = result.has_cancer ? 'positive' : 'negative';
    const icon = result.has_cancer ? 
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>` :
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
        </svg>`;
    
    const title = result.has_cancer ? 'Anomalía Detectada' : 'Resultado Normal';
    const description = result.has_cancer ? 
        'Se detectaron patrones que requieren evaluación médica adicional.' :
        'No se detectaron anomalías significativas en la imagen.';
    
    predictionResult.innerHTML = `
        <div class="result-status ${statusClass}">
            <div class="result-icon">
                ${icon}
            </div>
            <div class="result-content">
                <h4>${title}</h4>
                <p>${description}</p>
                <div class="result-confidence">Confianza: ${result.confidence_percentage.toFixed(1)}%</div>
            </div>
        </div>
        <div class="result-details">
            <div class="result-detail">
                <span class="result-detail-label">Archivo:</span>
                <span class="result-detail-value">${result.filename}</span>
            </div>
            <div class="result-detail">
                <span class="result-detail-label">Diagnóstico:</span>
                <span class="result-detail-value">${result.prediction_label}</span>
            </div>
            <div class="result-detail">
                <span class="result-detail-label">Probabilidad:</span>
                <span class="result-detail-value">${(result.prediction_probability * 100).toFixed(2)}%</span>
            </div>
        </div>
    `;
    
    predictionSection.classList.remove('hidden');
    
    // Scroll suave hacia el resultado
    predictionSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// Función para regresar
function goBack() {
    // Limpiar datos
    currentPatient = null;
    selectedFile = null;
    document.getElementById('cedula-input').value = '';
    document.getElementById('file-input').value = '';
    document.getElementById('upload-btn').disabled = true;
    
    // Limpiar imagen
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = `
        <div class="image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <p>Seleccionar imagen</p>
        </div>
    `;
    
    // Ocultar predicción
    document.getElementById('prediction-section').classList.add('hidden');
    
    // Cambiar secciones
    document.getElementById('patient-section').classList.add('hidden');
    document.getElementById('search-section').classList.remove('hidden');
}

// Event listener para Enter en el input de cédula
document.getElementById('cedula-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPatient();
    }
});

// Mensaje de bienvenida
console.log('🏥 Sistema de Diagnóstico de Cáncer de Mama - Frontend cargado correctamente');
console.log('📡 Conectando con backend en:', API_URL);
