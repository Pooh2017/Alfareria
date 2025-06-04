import React, { useEffect, useState } from 'react';

const getToken = () => localStorage.getItem('token');

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [idEditando, setIdEditando] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/categorias', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error al obtener categorías');
      setCategorias(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }

    try {
      const url = idEditando
        ? `http://localhost:4000/api/categorias/${idEditando}`
        : 'http://localhost:4000/api/categorias';
      const method = idEditando ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ nombre_categoria: nombre.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error al guardar categoría');

      setNombre('');
      setIdEditando(null);
      setError('');
      cargarCategorias();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (categoria) => {
    setNombre(categoria.nombre_categoria);
    setIdEditando(categoria.id_categoria);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta categoría?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/categorias/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error al eliminar categoría');
      cargarCategorias();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">CRUD Categorías</h1>

      {error && <div className="bg-red-200 text-red-800 p-3 mb-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de categoría"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {idEditando ? 'Actualizar' : 'Agregar'}
        </button>
        {idEditando && (
          <button
            type="button"
            onClick={() => {
              setNombre('');
              setIdEditando(null);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        )}
      </form>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Nombre Categoría</th>
              <th className="border p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id_categoria} className="hover:bg-gray-50">
                <td className="border p-2">{cat.id_categoria}</td>
                <td className="border p-2">{cat.nombre_categoria}</td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="bg-yellow-400 px-3 py-1 rounded text-white hover:bg-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id_categoria)}
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No hay categorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoriasPage;
