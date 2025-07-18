import React, { useState, useEffect } from 'react';
import type { Patient } from '../services/api';
import { patientAPI } from '../services/api';


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
              <div className="dashboard-actions">
                <button className="btn btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Crear Paciente
                </button>
                <button onClick={handleCreateSamples} className="btn btn-outline">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  Crear Datos de Prueba
                </button>
              </div>
            </div>
          </div>

          <div className="card patients-table-card">
            <div className="card-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <h2>Lista de Pacientes</h2>
              <button onClick={loadPatients} className="btn btn-outline btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M8 16H3v5"/>
                </svg>
                Actualizar
              </button>
            </div>
            <div className="card-content">
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
                                <button 
                                  onClick={() => onSelectPatient(patient)}
                                  className="btn btn-sm btn-primary"
                                >
                                  Analizar
                                </button>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
