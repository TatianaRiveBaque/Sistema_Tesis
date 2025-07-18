import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Prediction from './components/Prediction';
import type { Patient } from './services/api'; // ← Cambiar esta línea

type View = 'login' | 'dashboard' | 'prediction';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [doctorName, setDoctorName] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const savedDoctorName = localStorage.getItem('doctorName');
    
    if (token && savedDoctorName) {
      setDoctorName(savedDoctorName);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (name: string) => {
    setDoctorName(name);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('doctorName');
    setDoctorName('');
    setSelectedPatient(null);
    setCurrentView('login');
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('prediction');
  };

  const handleBackToDashboard = () => {
    setSelectedPatient(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="app">
      {currentView === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard 
          doctorName={doctorName}
          onLogout={handleLogout}
          onSelectPatient={handleSelectPatient}
        />
      )}
      
      {currentView === 'prediction' && selectedPatient && (
        <Prediction 
          patient={selectedPatient}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
