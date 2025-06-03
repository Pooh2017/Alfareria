import React, { useState } from 'react';
import { registerUser } from '../api/authService';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
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
    const { nombre, apellido, correo, contraseña } = formData;

    if (!nombre || !apellido || !correo || !contraseña) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError('Correo inválido');
      return false;
    }

    if (contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await registerUser(formData);
      setSuccess('Registro exitoso. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.msg || 'Error al registrar';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="form-box">
        <div className="form-header">
          <h2 className="form-title">Registro</h2>
          <p className="form-subtitle">Crea una cuenta nueva</p>
        </div>

        {error && (
          <div className="form-error">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="form-success">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-body">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={loading}
            className="input-text"
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            disabled={loading}
            className="input-text"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
            disabled={loading}
            className="input-text"
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            disabled={loading}
            className="input-text"
          />

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="form-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="login-link">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
