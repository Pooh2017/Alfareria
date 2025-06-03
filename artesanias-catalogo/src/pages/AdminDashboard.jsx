import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const irAArtesanos = () => {
    navigate('/admin/artesanos');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 text-center">
      <h2 className="text-3xl font-bold mb-6">Panel de Administración</h2>
      <p className="mb-6">Contenido privado para usuarios autenticados.</p>
      <button
        onClick={() => navigate('/admin/artesanos')}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Ir a Gestión de Artesanos
      </button>
      <button
        onClick={() => navigate('/admin/productos')}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Ir a Gestión de Productos
      </button>
    </div>
  );
};

export default AdminDashboard;
