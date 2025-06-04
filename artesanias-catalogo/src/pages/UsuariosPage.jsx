import React, { useEffect, useState } from 'react';

const getToken = () => localStorage.getItem('token');

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    id_usuario: null,
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    rol: 'visitante',
    telefono: ''
  });
  const [editing, setEditing] = useState(false);

  // Cargar usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/usuarios', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      if (!res.ok) throw new Error('Error cargando usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Manejar inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (error) setError('');
  };

  // Enviar formulario (Crear o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!form.nombre || !form.apellido || !form.correo || (!editing && !form.contraseña)) {
      setError('Nombre, Apellido, Correo y Contraseña (al crear) son obligatorios');
      return;
    }

    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing
        ? `http://localhost:4000/api/usuarios/${form.id_usuario}`
        : 'http://localhost:4000/api/usuarios';

      const bodyData = { ...form };
      if (editing && !form.contraseña) {
        // No enviar contraseña vacía en edición (para no cambiarla)
        delete bodyData.contraseña;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error en la operación');

      // Refrescar lista
      fetchUsuarios();
      setForm({ id_usuario: null, nombre: '', apellido: '', correo: '', contraseña: '', rol: 'visitante', telefono: '' });
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  };

  // Iniciar edición
  const startEdit = (usuario) => {
    setForm({ ...usuario, contraseña: '' }); // No mostrar contraseña por seguridad
    setEditing(true);
    setError('');
  };

  // Cancelar edición
  const cancelEdit = () => {
    setForm({ id_usuario: null, nombre: '', apellido: '', correo: '', contraseña: '', rol: 'visitante', telefono: '' });
    setEditing(false);
    setError('');
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error eliminando usuario');
      fetchUsuarios();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">CRUD Usuarios</h1>

      {error && (
        <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-xl mb-4">{editing ? 'Editar Usuario' : 'Crear Usuario'}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="nombre"
            placeholder="Nombre *"
            value={form.nombre}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="apellido"
            placeholder="Apellido *"
            value={form.apellido}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="correo"
            type="email"
            placeholder="Correo *"
            value={form.correo}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="contraseña"
            type="password"
            placeholder={editing ? "Dejar vacío para no cambiar" : "Contraseña *"}
            value={form.contraseña}
            onChange={handleChange}
            className="p-2 border rounded"
            required={!editing}
          />
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="visitante">Visitante</option>
          </select>
          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editing ? 'Actualizar' : 'Crear'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-2xl mb-4">Lista de Usuarios</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Nombre</th>
                <th className="border p-2 text-left">Apellido</th>
                <th className="border p-2 text-left">Correo</th>
                <th className="border p-2 text-left">Rol</th>
                <th className="border p-2 text-left">Teléfono</th>
                <th className="border p-2 text-left">Fecha Registro</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id_usuario} className="hover:bg-gray-100">
                  <td className="border p-2">{u.nombre}</td>
                  <td className="border p-2">{u.apellido}</td>
                  <td className="border p-2">{u.correo}</td>
                  <td className="border p-2">{u.rol}</td>
                  <td className="border p-2">{u.telefono || '-'}</td>
                  <td className="border p-2">{new Date(u.fecha_registro).toLocaleString()}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => startEdit(u)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.id_usuario)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;
