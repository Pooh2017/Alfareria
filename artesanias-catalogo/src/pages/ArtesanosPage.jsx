import React, { useEffect, useState } from 'react';

// Helper para token, asumiendo que lo guardas en localStorage
const getToken = () => localStorage.getItem('token');

const ArtesanosPage = () => {
  const [artesanos, setArtesanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    id_artesano: null,
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    descripcion: '',
    imagen_perfil: '',
    ubicacion: ''
  });
  const [editing, setEditing] = useState(false);

  // Obtener lista de artesanos
  const fetchArtesanos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/artesanos');
      if (!res.ok) throw new Error('Error cargando artesanos');
      const data = await res.json();
      setArtesanos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtesanos();
  }, []);

  // Manejo del formulario
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (error) setError('');
  };

  // Crear o actualizar artesano
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Validar campos básicos
    if (!form.nombre || !form.apellido) {
      setError('Nombre y Apellido son obligatorios');
      return;
    }

    const method = editing ? 'PUT' : 'POST';
    const url = editing 
      ? `http://localhost:4000/api/artesanos/${form.id_artesano}` 
      : 'http://localhost:4000/api/artesanos';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || 'Error en la operación');

      // Recargar lista y limpiar form
      await fetchArtesanos();
      setForm({
        id_artesano: null,
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        descripcion: '',
        imagen_perfil: '',
        ubicacion: ''
      });
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  };

  // Editar: cargar datos al form
  const startEdit = (artesano) => {
    setForm(artesano);
    setEditing(true);
    setError('');
  };

  // Cancelar edición
  const cancelEdit = () => {
    setForm({
      id_artesano: null,
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      descripcion: '',
      imagen_perfil: '',
      ubicacion: ''
    });
    setEditing(false);
    setError('');
  };

  // Eliminar artesano
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este artesano?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/artesanos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error eliminando artesano');
      await fetchArtesanos();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">CRUD Artesanos</h1>

      {error && (
        <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>
      )}

      {/* Formulario Crear/Editar */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-xl mb-4">{editing ? 'Editar Artesano' : 'Crear Artesano'}</h2>
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
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="p-2 border rounded col-span-1 md:col-span-2"
          />
          <input
            name="imagen_perfil"
            placeholder="URL Imagen Perfil"
            value={form.imagen_perfil}
            onChange={handleChange}
            className="p-2 border rounded col-span-1 md:col-span-2"
          />
          <input
            name="ubicacion"
            placeholder="Ubicación"
            value={form.ubicacion}
            onChange={handleChange}
            className="p-2 border rounded col-span-1 md:col-span-2"
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

      {/* Lista de Artesanos */}
      <div>
        <h2 className="text-2xl mb-4">Lista de Artesanos</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : artesanos.length === 0 ? (
          <p>No hay artesanos registrados.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Nombre</th>
                <th className="border p-2 text-left">Apellido</th>
                <th className="border p-2 text-left">Teléfono</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Descripción</th>
                <th className="border p-2 text-left">Ubicación</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {artesanos.map(a => (
                <tr key={a.id_artesano} className="hover:bg-gray-100">
                  <td className="border p-2">{a.nombre}</td>
                  <td className="border p-2">{a.apellido}</td>
                  <td className="border p-2">{a.telefono}</td>
                  <td className="border p-2">{a.email}</td>
                  <td className="border p-2">{a.descripcion}</td>
                  <td className="border p-2">{a.ubicacion}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => startEdit(a)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(a.id_artesano)}
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

export default ArtesanosPage;
  