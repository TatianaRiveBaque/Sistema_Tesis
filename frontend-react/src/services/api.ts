import axios from 'axios';

const API_BASE_URL = 'https://app-ml-tesis-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('doctorName');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  full_name: string;
  password: string;
}

export interface Patient {
  apellido_paterno: string;
  apellido_materno: string;
  nombre: string;
  fecha_nacimiento: string;
  sexo: string;
  estado_civil: string;
  tipo_documento: string;
  numero_documento: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  ocupacion?: string;
  persona_responsable?: string;
  alergias?: string;
  intervenciones_quirurgicas?: string;
  vacunas_completas?: string;
  antecedentes_familiares_cancer?: string;
  fecha_ultimo_examen?: string;
  edad?: number;
  tipo_cancer?: string;
  etapa?: string;
  ultima_consulta?: string;
}

export interface PredictionResult {
  prediction_label: string;
  confidence_percentage: number;
  prediction_probability: number;
  has_cancer: boolean;
  etapa_cancer?: string;
  message: string;
  filename: string;
}

// API functions
export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  
  register: (data: RegisterData) => 
    api.post('/auth/register', data),
};

export const patientAPI = {
  getAll: () => api.get('/patients'),
  
  getById: (id: string) => api.get(`/patients/${id}`),
  
  create: (patient: Patient) => api.post('/patients', patient),
  
  search: (numeroDocumento: string) => api.get(`/patients/${numeroDocumento}`),
  
  createSamples: () => api.post('/api/createuserfordoctorgeneric'),
};

export const predictionAPI = {
  predict: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};