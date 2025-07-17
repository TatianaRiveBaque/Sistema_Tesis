import React, { useState } from 'react';
import { authAPI } from '../services/api';

interface LoginProps {
  onLogin: (doctorName: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(loginData);
      const { access_token } = response.data;
      
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('doctorName', loginData.username);
      
      onLogin(loginData.username);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.register(registerData);
      const { access_token } = response.data;
      
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('doctorName', registerData.full_name);
      
      onLogin(registerData.full_name);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al registrar doctor');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem('authToken', 'demo-token');
    localStorage.setItem('doctorName', 'Demo Doctor');
    onLogin('Demo Doctor');
  };

  return (
    <div className="login-section">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <h1>Sistema de Diagnóstico</h1>
            <p>Análisis de Cáncer de Mama - Solo para Doctores</p>
          </div>
          
          <div className="login-tabs">
            <button 
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Iniciar Sesión
            </button>
            <button 
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="login-username">Usuario</label>
                <input
                  type="text"
                  id="login-username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Contraseña</label>
                <input
                  type="password"
                  id="login-password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="login-form">
              <div className="form-group">
                <label htmlFor="register-username">Usuario</label>
                <input
                  type="text"
                  id="register-username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-fullname">Nombre Completo</label>
                <input
                  type="text"
                  id="register-fullname"
                  value={registerData.full_name}
                  onChange={(e) => setRegisterData({...registerData, full_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-password">Contraseña</label>
                <input
                  type="password"
                  id="register-password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>
          )}
          
          <div className="demo-info">
            <p><strong>Demo:</strong> ¿No tienes conexión? 
              <button onClick={handleDemoLogin} className="btn btn-outline btn-sm" style={{marginLeft: '0.5rem'}}>
                Probar Demo
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;