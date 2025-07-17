// Variables globales
let currentPatient = null;
let selectedFile = null;
let authToken = null;

// URL del backend
const API_URL = 'http://localhost:8001';

// Authentication Functions
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.querySelector('.tab-btn:first-child');
    const registerTab = document.querySelector('.tab-btn:last-child');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

async function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Modo demo - verificar credenciales hardcodeadas
    if (username === 'admin' && password === 'admin123') {
        authToken = 'demo-token';
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('doctorName', username);
        
        showDashboard();
        loadPatients();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.access_token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('doctorName', username);
            
            showDashboard();
            loadPatients();
        } else {
            const error = await response.json();
            alert(error.detail || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Usando modo demo. Credenciales: admin/admin123');
    }
}

async function register(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const full_name = document.getElementById('register-fullname').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, full_name, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.access_token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('doctorName', full_name);
            
            showDashboard();
            loadPatients();
        } else {
            const error = await response.json();
            alert(error.detail || 'Error al registrar doctor');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('doctorName');
    showLogin();
}

function showLogin() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('prediction-section').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
    document.getElementById('prediction-section').classList.add('hidden');
    
    const doctorName = localStorage.getItem('doctorName') || 'Doctor';
    document.getElementById('doctor-name').textContent = `Dr. ${doctorName}`;
}

function showPredictionSection() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('prediction-section').classList.remove('hidden');
}

// Dashboard Functions
async function loadPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`);
        
        if (response.ok) {
            const patients = await response.json();
            displayPatientsTable(patients);
        } else {
            console.error('Error loading patients');
        }
    } catch (error) {
        console.error('Error:', error);
        // Modo demo - usar datos fake
        const demoPatients = [
            {
                nombre: 'María',
                apellido_paterno: 'García',
                apellido_materno: 'López',
                numero_documento: '12345678',
                edad: 45,
                tipo_cancer: 'No determinado',
                etapa: 'N/A',
                ultima_consulta: '2024-01-15'
            },
            {
                nombre: 'Ana',
                apellido_paterno: 'Martínez',
                apellido_materno: 'Ruiz',
                numero_documento: '87654321',
                edad: 38,
                tipo_cancer: 'No determinado',
                etapa: 'N/A',
                ultima_consulta: '2024-01-20'
            }
        ];
        displayPatientsTable(demoPatients);
    }
}

function displayPatientsTable(patients) {
    const tbody = document.getElementById('patients-tbody');
    
    if (patients.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="7">No hay pacientes registrados</td></tr>';
        return;
    }

    tbody.innerHTML = patients.map(patient => {
        const nombreCompleto = `${patient.nombre} ${patient.apellido_paterno} ${patient.apellido_materno}`;
        return `
            <tr>
                <td>${nombreCompleto}</td>
                <td>${patient.numero_documento}</td>
                <td>${patient.edad || 'N/A'}</td>
                <td>${patient.tipo_cancer || 'No determinado'}</td>
                <td>${patient.etapa || 'N/A'}</td>
                <td>${patient.ultima_consulta || 'N/A'}</td>
                <td>
                    <button onclick="selectPatientForPrediction('${patient.numero_documento}')" class="btn btn-sm btn-primary">
                        Analizar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function searchPatient() {
    const numeroDocumento = document.getElementById('search-input').value.trim();
    
    if (!numeroDocumento) {
        alert('Por favor ingrese un número de documento');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/patients/${numeroDocumento}`);
        
        if (response.ok) {
            const patient = await response.json();
            selectPatientForPrediction(numeroDocumento);
        } else {
            alert('Paciente no encontrado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

async function selectPatientForPrediction(numeroDocumento) {
    try {
        const response = await fetch(`${API_URL}/patients/${numeroDocumento}`);
        
        if (response.ok) {
            const patient = await response.json();
            currentPatient = patient;
            showPredictionSection();
            displayPatientInfo(patient);
            
            const nombreCompleto = `${patient.nombre} ${patient.apellido_paterno} ${patient.apellido_materno}`;
            document.getElementById('current-patient-name').textContent = nombreCompleto;
        } else {
            alert('Error al cargar información del paciente');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

// Create Patient Modal Functions
function showCreatePatientModal() {
    document.getElementById('create-patient-modal').classList.remove('hidden');
}

function hideCreatePatientModal() {
    document.getElementById('create-patient-modal').classList.add('hidden');
    document.getElementById('create-patient-form').reset();
}

async function createPatient(event) {
    event.preventDefault();
    
    const formData = {
        apellido_paterno: document.getElementById('apellido-paterno').value,
        apellido_materno: document.getElementById('apellido-materno').value,
        nombre: document.getElementById('nombre').value,
        fecha_nacimiento: document.getElementById('fecha-nacimiento').value,
        sexo: document.getElementById('sexo').value,
        estado_civil: document.getElementById('estado-civil').value,
        tipo_documento: document.getElementById('tipo-documento').value,
        numero_documento: document.getElementById('numero-documento').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        ocupacion: document.getElementById('ocupacion').value,
        persona_responsable: document.getElementById('persona-responsable').value,
        alergias: document.getElementById('alergias').value,
        intervenciones_quirurgicas: document.getElementById('intervenciones-quirurgicas').value,
        vacunas_completas: document.getElementById('vacunas-completas').value,
        antecedentes_familiares_cancer: document.getElementById('antecedentes-familiares').value,
        fecha_ultimo_examen: document.getElementById('fecha-ultimo-examen').value
    };

    try {
        const response = await fetch(`${API_URL}/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const patient = await response.json();
            hideCreatePatientModal();
            loadPatients();
            alert('Paciente creado exitosamente');
        } else {
            const error = await response.json();
            alert(error.detail || 'Error al crear paciente');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

async function createSamplePatients() {
    try {
        const response = await fetch(`${API_URL}/api/createuserfordoctorgeneric`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            loadPatients();
        } else {
            alert('Error al crear pacientes de prueba');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

// Patient Info Display
function displayPatientInfo(patient) {
    const patientInfo = document.getElementById('patient-info');
    const nombreCompleto = `${patient.nombre} ${patient.apellido_paterno} ${patient.apellido_materno}`;
    
    patientInfo.innerHTML = `
        <div class="patient-detail">
            <label>Nombre Completo:</label>
            <span>${nombreCompleto}</span>
        </div>
        <div class="patient-detail">
            <label>Documento:</label>
            <span>${patient.tipo_documento}: ${patient.numero_documento}</span>
        </div>
        <div class="patient-detail">
            <label>Edad:</label>
            <span>${patient.edad || 'N/A'} años</span>
        </div>
        <div class="patient-detail">
            <label>Sexo:</label>
            <span>${patient.sexo}</span>
        </div>
        <div class="patient-detail">
            <label>Fecha de Nacimiento:</label>
            <span>${patient.fecha_nacimiento}</span>
        </div>
        <div class="patient-detail">
            <label>Estado Civil:</label>
            <span>${patient.estado_civil}</span>
        </div>
        <div class="patient-detail">
            <label>Teléfono:</label>
            <span>${patient.telefono || 'No especificado'}</span>
        </div>
        <div class="patient-detail">
            <label>Email:</label>
            <span>${patient.email || 'No especificado'}</span>
        </div>
        <div class="patient-detail">
            <label>Ocupación:</label>
            <span>${patient.ocupacion || 'No especificado'}</span>
        </div>
        <div class="patient-detail">
            <label>Alergias:</label>
            <span>${patient.alergias || 'Ninguna conocida'}</span>
        </div>
        <div class="patient-detail">
            <label>Antecedentes Familiares:</label>
            <span>${patient.antecedentes_familiares_cancer || 'Sin antecedentes conocidos'}</span>
        </div>
        <div class="patient-detail">
            <label>Último Examen:</label>
            <span>${patient.fecha_ultimo_examen || 'No especificado'}</span>
        </div>
    `;
}

// Image and Prediction Functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        selectedFile = file;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageContainer = document.getElementById('image-container');
            imageContainer.innerHTML = `
                <img src="${e.target.result}" alt="Imagen seleccionada" style="max-width: 100%; max-height: 300px; border-radius: 8px;">
            `;
        };
        reader.readAsDataURL(file);
        
        document.getElementById('upload-btn').disabled = false;
    } else {
        alert('Por favor seleccione un archivo de imagen válido');
    }
}

async function uploadAndPredict() {
    if (!selectedFile) {
        alert('Por favor seleccione una imagen primero');
        return;
    }

    if (!currentPatient) {
        alert('No hay paciente seleccionado');
        return;
    }

    showLoading();

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            hideLoading();
            displayPredictionResult(result);
            
            // Update patient with cancer info if detected
            if (result.has_cancer && result.etapa_cancer) {
                updatePatientCancerInfo(result);
            }
        } else {
            hideLoading();
            const error = await response.json();
            alert(error.detail || 'Error en la predicción');
        }
    } catch (error) {
        hideLoading();
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

function displayPredictionResult(result) {
    const predictionResult = document.getElementById('prediction-result');
    const resultClass = result.has_cancer ? 'positive' : 'negative';
    
    let etapaInfo = '';
    if (result.has_cancer && result.etapa_cancer) {
        etapaInfo = `
            <div class="prediction-detail">
                <label>Etapa del Cáncer:</label>
                <span class="stage-${result.etapa_cancer.toLowerCase().replace(/\s+/g, '-')}">${result.etapa_cancer}</span>
            </div>
        `;
    }
    
    predictionResult.innerHTML = `
        <div class="prediction-card ${resultClass}">
            <div class="prediction-header">
                <h4>${result.prediction_label}</h4>
                <div class="confidence">${result.confidence_percentage.toFixed(2)}% de confianza</div>
            </div>
            <div class="prediction-details">
                <div class="prediction-detail">
                    <label>Archivo:</label>
                    <span>${result.filename}</span>
                </div>
                <div class="prediction-detail">
                    <label>Probabilidad:</label>
                    <span>${(result.prediction_probability * 100).toFixed(2)}%</span>
                </div>
                ${etapaInfo}
                <div class="prediction-detail">
                    <label>Mensaje:</label>
                    <span>${result.message}</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('results-section').classList.remove('hidden');
}

async function updatePatientCancerInfo(result) {
    // This would typically update the patient record in the database
    // For now, we'll just update the local patient object
    if (currentPatient) {
        currentPatient.tipo_cancer = "Cáncer de Mama";
        currentPatient.etapa = result.etapa_cancer;
        currentPatient.ultima_consulta = new Date().toISOString().split('T')[0];
    }
}

// Navigation Functions
function goBackToDashboard() {
    showDashboard();
    loadPatients();
    
    // Reset prediction section
    document.getElementById('image-container').innerHTML = `
        <div class="image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <p>Seleccionar imagen</p>
        </div>
    `;
    document.getElementById('results-section').classList.add('hidden');
    document.getElementById('upload-btn').disabled = true;
    selectedFile = null;
    currentPatient = null;
}

// Utility Functions
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        showDashboard();
        loadPatients();
    } else {
        showLogin();
    }

    // Login form event listener
    document.getElementById('login-form').addEventListener('submit', login);
    
    // Register form event listener
    document.getElementById('register-form').addEventListener('submit', register);
    
    // Create patient form event listener
    document.getElementById('create-patient-form').addEventListener('submit', createPatient);
    
    // Search input enter key listener
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchPatient();
        }
    });
});