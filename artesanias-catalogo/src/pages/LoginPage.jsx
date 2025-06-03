import React, { useState } from 'react';
import '../styles/login.css';
import { loginUser } from '../api/authService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.correo || !formData.contraseña) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor ingresa un correo válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Enviando datos:', formData);
      
      // Usar tu función loginUser en lugar de fetch directo
      const response = await loginUser(formData);
      
      console.log('Respuesta login:', response.data);
      
      // Verificar que el token existe
      if (!response.data.token) {
        throw new Error('No se recibió token del servidor');
      }

      // Usar tu contexto de autenticación
      await login(response.data.token);
      
      // Redirigir a la página de admin
      navigate('/admin');
      
    } catch (err) {
      console.error('Error completo:', err);
      
      let errorMessage = 'Error al iniciar sesión';
      
      if (err.response) {
        // Error del servidor (400, 401, 500, etc.)
        errorMessage = err.response.data?.msg || `Error ${err.response.status}`;
      } else if (err.request) {
        // Error de red - no se pudo hacer la petición
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:4000';
      } else if (err.message) {
        // Otros errores
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="login-container">
  <div className="login-box">
    <h2>Iniciar Sesión</h2>
    <p className="subtitle">Accede a tu cuenta</p>

    {error && <div className="error-message">⚠️ {error}</div>}

    <label htmlFor="correo">Correo Electrónico</label>
    <input
      id="correo"
      name="correo"
      type="email"
      placeholder="tu@email.com"
      value={formData.correo}
      onChange={handleChange}
      disabled={loading}
    />

    <label htmlFor="contraseña">Contraseña</label>
    <input
      id="contraseña"
      name="contraseña"
      type="password"
      placeholder="••••••••"
      value={formData.contraseña}
      onChange={handleChange}
      disabled={loading}
    />

    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Iniciando...' : 'Iniciar Sesión'}
    </button>

    <p className="register-link">
      ¿No tienes cuenta?{' '}
      <Link to="/register">
        Regístrate aquí
      </Link>
    </p>
  </div>
</div>


  );
};

export default LoginPage;