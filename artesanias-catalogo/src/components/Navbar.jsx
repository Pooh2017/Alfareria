import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Inicio</Link>

      {user ? (
        <>

          {/* Solo mostrar para admin */}
          {user.rol === 'admin' && (
            <>
              <Link to="/admin/dashboard">Panel Admin</Link>
              <Link to="/admin/artesanos">Gestionar Artesanos</Link>
              <Link to="/admin/productos">Gestionar Productos</Link>
              <Link to="/admin/usuarios">Gestionar Usuarios</Link>
              <Link to="/admin/categorias">Gestionar categorias</Link>
              {/* Otros links exclusivos para admin */}
            </>
          )}

          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Ingresar</Link>
          <Link to="/register">Registrar</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
