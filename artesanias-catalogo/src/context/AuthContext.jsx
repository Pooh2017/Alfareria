import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Import correcto

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ SIN .default
        setUser({ id: decoded.id_usuario, rol: decoded.rol, nombre: decoded.nombre });
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token); // ✅ SIN .default
      setUser({ id: decoded.id_usuario, rol: decoded.rol });
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Token inválido:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};