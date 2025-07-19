// Configuración del Frontend
const CONFIG = {
    // URLs de API según entorno
    API_URLS: {
        development: 'http://localhost:8000',
        production: 'https://sistema-diagnostico-backend.onrender.com' // Actualizar con tu URL real
    },
    
    // Configuración de la aplicación
    APP: {
        name: 'Sistema de Diagnóstico de Cáncer de Mama',
        version: '1.0.0',
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFormats: ['image/jpeg', 'image/jpg', 'image/png']
    },
    
    // Mensajes de la aplicación
    MESSAGES: {
        fileTooBig: 'El archivo es muy grande. Máximo 10MB.',
        invalidFormat: 'Formato no válido. Use JPG, JPEG o PNG.',
        connectionError: 'Error de conexión. Verifique su internet.',
        noPatient: 'Paciente no encontrado.',
        uploadSuccess: 'Imagen cargada correctamente.',
        predictionError: 'Error al procesar la imagen.'
    }
};

// Detectar entorno automáticamente
function getApiUrl() {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    return isLocalhost ? CONFIG.API_URLS.development : CONFIG.API_URLS.production;
}

// Exportar configuración
window.APP_CONFIG = CONFIG;
window.API_URL = getApiUrl();

console.log('🔧 Configuración cargada:', {
    environment: window.location.hostname === 'localhost' ? 'development' : 'production',
    apiUrl: window.API_URL
});
