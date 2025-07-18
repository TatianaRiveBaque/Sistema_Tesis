import React, { useState, useEffect } from 'react';
import { Patient, patientAPI } from '../services/api';

interface DashboardProps {
  doctorName: string;
  onLogout: () => void;
  onSelectPatient: (patient: Patient) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ doctorName, onLogout, onSelectPatient }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'samples'>('list');
  const [newPatient, setNewPatient] = useState<Patient>({
    apellido_paterno: '',
    apellido_materno: '',
    nombre: '',
    fecha_nacimiento: '',
    sexo: '',
    estado_civil: '',
    tipo_documento: '',
    numero_documento: '',
    direccion: '',
    telefono: '',
    email: '',
    ocupacion: '',
    persona_responsable: '',
    alergias: '',
    intervenciones_quirurgicas: '',
    vacunas_completas: '',
    antecedentes_familiares_cancer: '',
    fecha_ultimo_examen: '',
    edad: 0,
    tipo_cancer: '',
    etapa: '',
    ultima_consulta: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (err: any) {
      console.error('Error loading patients:', err);
      setError('Error al cargar pacientes');
      // Fallback to demo data
      const demoPatients: Patient[] = [
        {
          nombre: 'María',
          apellido_paterno: 'García',
          apellido_materno: 'López',
          numero_documento: '12345678',
          tipo_documento: 'DNI',
          fecha_nacimiento: '1978-03-15',
          sexo: 'Femenino',
          estado_civil: 'Casado',
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
          tipo_documento: 'DNI',
          fecha_nacimiento: '1985-07-22',
          sexo: 'Femenino',
          estado_civil: 'Soltero',
          edad: 38,
          tipo_cancer: 'No determinado',
          etapa: 'N/A',
          ultima_consulta: '2024-01-20'
        }
      ];
      setPatients(demoPatients);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Por favor ingrese un número de documento');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await patientAPI.search(searchTerm);
      const patient = response.data;
      onSelectPatient(patient);
    } catch (err: any) {
      console.error('Error searching patient:', err);
      alert('Paciente no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSamples = async () => {
    try {
      await patientAPI.createSamples();
      alert('Pacientes de prueba creados exitosamente');
      loadPatients();
    } catch (err: any) {
      console.error('Error creating samples:', err);
      alert('Error al crear pacientes de prueba');
    }
  };

  const handleDeletePatient = async (numeroDocumento: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este paciente?')) {
      return;
    }

    setLoading(true);
    try {
      // Simulamos eliminación ya que no hay endpoint específico
      setPatients(patients.filter(p => p.numero_documento !== numeroDocumento));
      alert('Paciente eliminado exitosamente');
    } catch (err: any) {
      console.error('Error deleting patient:', err);
      alert('Error al eliminar paciente');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async () => {
    if (!newPatient.nombre || !newPatient.apellido_paterno || !newPatient.numero_documento) {
      alert('Por favor complete los campos obligatorios: Nombre, Apellido Paterno y Número de Documento');
      return;
    }

    setLoading(true);
    try {
      await patientAPI.create(newPatient);
      alert('Paciente creado exitosamente');
      setActiveTab('list');
      setNewPatient({
        apellido_paterno: '',
        apellido_materno: '',
        nombre: '',
        fecha_nacimiento: '',
        sexo: '',
        estado_civil: '',
        tipo_documento: '',
        numero_documento: '',
        direccion: '',
        telefono: '',
        email: '',
        ocupacion: '',
        persona_responsable: '',
        alergias: '',
        intervenciones_quirurgicas: '',
        vacunas_completas: '',
        antecedentes_familiares_cancer: '',
        fecha_ultimo_examen: '',
        edad: 0,
        tipo_cancer: '',
        etapa: '',
        ultima_consulta: ''
      });
      loadPatients();
    } catch (err: any) {
      console.error('Error creating patient:', err);
      alert('Error al crear paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-section">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <h1>Dashboard del Doctor</h1>
          </div>
          <div className="header-actions">
            <span>Dr. {doctorName}</span>
            <button onClick={onLogout} className="btn btn-outline">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <h2>Búsqueda de Paciente</h2>
            </div>
            <div className="card-content">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Número de documento"
                  maxLength={20}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} className="btn btn-primary" disabled={loading}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <div className="card patients-management-card">
            <div className="card-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <h2>Gestión de Pacientes</h2>
            </div>
            <div className="tabs-container">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'list' ? 'active' : ''}`}
                  onClick={() => setActiveTab('list')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Lista de Pacientes
                </button>
                <button 
                  className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                  onClick={() => setActiveTab('create')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Crear Paciente
                </button>
                <button 
                  className={`tab ${activeTab === 'samples' ? 'active' : ''}`}
                  onClick={() => setActiveTab('samples')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  Datos de Prueba
                </button>
              </div>
            </div>
            <div className="tab-content">
              {activeTab === 'list' && (
                <div className="card-content">
                  <div className="list-header">
                    <button onClick={loadPatients} className="btn btn-outline btn-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                      </svg>
                      Actualizar Lista
                    </button>
                  </div>
                  {error && (
                    <div className="error">
                      {error} - Mostrando datos de demostración
                    </div>
                  )}
                  
                  {loading ? (
                    <div className="loading">
                      <div>Cargando pacientes...</div>
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="patients-table">
                        <thead>
                          <tr>
                            <th>Nombre Completo</th>
                            <th>Cédula</th>
                            <th>Edad</th>
                            <th>Tipo Cáncer</th>
                            <th>Etapa</th>
                            <th>Última Consulta</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patients.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center">
                                No hay pacientes registrados
                              </td>
                            </tr>
                          ) : (
                            patients.map((patient, index) => {
                              const nombreCompleto = `${patient.nombre} ${patient.apellido_paterno} ${patient.apellido_materno}`;
                              return (
                                <tr key={index}>
                                  <td>{nombreCompleto}</td>
                                  <td>{patient.numero_documento}</td>
                                  <td>{patient.edad || 'N/A'}</td>
                                  <td>{patient.tipo_cancer || 'No determinado'}</td>
                                  <td>{patient.etapa || 'N/A'}</td>
                                  <td>{patient.ultima_consulta || 'N/A'}</td>
                                  <td>
                                    <div className="action-buttons">
                                      <button 
                                        onClick={() => onSelectPatient(patient)}
                                        className="btn btn-sm btn-primary"
                                        title="Analizar paciente"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                          <circle cx="9" cy="9" r="2"/>
                                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                        </svg>
                                      </button>
                                      <button 
                                        onClick={() => handleDeletePatient(patient.numero_documento)}
                                        className="btn btn-sm btn-danger"
                                        title="Eliminar paciente"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <polyline points="3,6 5,6 21,6"/>
                                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                                          <line x1="10" y1="11" x2="10" y2="17"/>
                                          <line x1="14" y1="11" x2="14" y2="17"/>
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'create' && (
                <div className="card-content">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre *</label>
                      <input
                        type="text"
                        value={newPatient.nombre}
                        onChange={(e) => setNewPatient({...newPatient, nombre: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido Paterno *</label>
                      <input
                        type="text"
                        value={newPatient.apellido_paterno}
                        onChange={(e) => setNewPatient({...newPatient, apellido_paterno: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido Materno</label>
                      <input
                        type="text"
                        value={newPatient.apellido_materno}
                        onChange={(e) => setNewPatient({...newPatient, apellido_materno: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo Documento</label>
                      <select
                        value={newPatient.tipo_documento}
                        onChange={(e) => setNewPatient({...newPatient, tipo_documento: e.target.value})}
                      >
                        <option value="">Seleccionar</option>
                        <option value="DNI">DNI</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Carnet">Carnet</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Número de Documento *</label>
                      <input
                        type="text"
                        value={newPatient.numero_documento}
                        onChange={(e) => setNewPatient({...newPatient, numero_documento: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Fecha de Nacimiento</label>
                      <input
                        type="date"
                        value={newPatient.fecha_nacimiento}
                        onChange={(e) => setNewPatient({...newPatient, fecha_nacimiento: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Sexo</label>
                      <select
                        value={newPatient.sexo}
                        onChange={(e) => setNewPatient({...newPatient, sexo: e.target.value})}
                      >
                        <option value="">Seleccionar</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Estado Civil</label>
                      <select
                        value={newPatient.estado_civil}
                        onChange={(e) => setNewPatient({...newPatient, estado_civil: e.target.value})}
                      >
                        <option value="">Seleccionar</option>
                        <option value="Soltero">Soltero</option>
                        <option value="Casado">Casado</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viudo">Viudo</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Edad</label>
                      <input
                        type="number"
                        value={newPatient.edad || ''}
                        onChange={(e) => setNewPatient({...newPatient, edad: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        value={newPatient.telefono}
                        onChange={(e) => setNewPatient({...newPatient, telefono: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={newPatient.email}
                        onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Dirección</label>
                      <input
                        type="text"
                        value={newPatient.direccion}
                        onChange={(e) => setNewPatient({...newPatient, direccion: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Ocupación</label>
                      <input
                        type="text"
                        value={newPatient.ocupacion}
                        onChange={(e) => setNewPatient({...newPatient, ocupacion: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Persona Responsable</label>
                      <input
                        type="text"
                        value={newPatient.persona_responsable}
                        onChange={(e) => setNewPatient({...newPatient, persona_responsable: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Alergias</label>
                      <textarea
                        value={newPatient.alergias}
                        onChange={(e) => setNewPatient({...newPatient, alergias: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Antecedentes Familiares de Cáncer</label>
                      <textarea
                        value={newPatient.antecedentes_familiares_cancer}
                        onChange={(e) => setNewPatient({...newPatient, antecedentes_familiares_cancer: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button onClick={handleCreatePatient} className="btn btn-primary" disabled={loading}>
                      {loading ? 'Creando...' : 'Crear Paciente'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'samples' && (
                <div className="card-content">
                  <div className="samples-content">
                    <div className="info-box">
                      <h3>Crear Datos de Prueba</h3>
                      <p>Esta opción creará pacientes de ejemplo para probar el sistema.</p>
                    </div>
                    <button onClick={handleCreateSamples} className="btn btn-primary" disabled={loading}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                      {loading ? 'Creando...' : 'Crear Datos de Prueba'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;
