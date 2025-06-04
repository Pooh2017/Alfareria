import React, { useEffect, useState } from 'react';

const getToken = () => localStorage.getItem('token');

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [artesanos, setArtesanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    id_producto: null,
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    estado: 'Disponible',
    destacado: false,
    id_categoria: '',
    id_artesano: ''
  });
  const [editing, setEditing] = useState(false);

  const fetchProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/productos');
      if (!res.ok) throw new Error('Error cargando productos');
      const data = await res.json();
      setProductos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

const fetchCategorias = async () => {
  try {
    const token = getToken(); // tu función para obtener token del localStorage
    const res = await fetch('http://localhost:4000/api/categorias', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Error cargando categorías');
    const data = await res.json();
    setCategorias(data);
  } catch (e) {
    console.error(e.message);
  }
};


  const fetchArtesanos = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/artesanos');
      if (!res.ok) throw new Error('Error cargando artesanos');
      const data = await res.json();
      setArtesanos(data);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchArtesanos();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!form.nombre || !form.precio) {
      setError('Nombre y Precio son obligatorios');
      return;
    }

    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `http://localhost:4000/api/productos/${form.id_producto}`
      : 'http://localhost:4000/api/productos';

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

      await fetchProductos();
      setForm({
        id_producto: null,
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        estado: 'Disponible',
        destacado: false,
        id_categoria: '',
        id_artesano: ''
      });
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const startEdit = (producto) => {
    setForm(producto);
    setEditing(true);
    setError('');
  };

  const cancelEdit = () => {
    setForm({
      id_producto: null,
      nombre: '',
      descripcion: '',
      precio: '',
      imagen: '',
      estado: 'Disponible',
      destacado: false,
      id_categoria: '',
      id_artesano: ''
    });
    setEditing(false);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Error eliminando producto');
      await fetchProductos();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">CRUD Productos</h1>

      {error && (
        <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-xl mb-4">{editing ? 'Editar Producto' : 'Crear Producto'}</h2>
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
            name="precio"
            type="number"
            step="0.01"
            placeholder="Precio *"
            value={form.precio}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            name="imagen"
            placeholder="URL Imagen"
            value={form.imagen}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="Disponible">Disponible</option>
            <option value="Agotado">Agotado</option>
          </select>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="destacado"
              checked={form.destacado}
              onChange={handleChange}
              className="mr-2"
            />
            Destacado
          </label>
          <select
            name="id_categoria"
            value={form.id_categoria}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre_categoria}
              </option>
            ))}
          </select>
          <select
            name="id_artesano"
            value={form.id_artesano}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Seleccione un artesano</option>
            {artesanos.map(a => (
              <option key={a.id_artesano} value={a.id_artesano}>
                {a.nombre} {a.apellido}
              </option>
            ))}
          </select>
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
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

      <div>
        <h2 className="text-2xl mb-4">Lista de Productos</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Nombre</th>
                <th className="border p-2 text-left">Precio</th>
                <th className="border p-2 text-left">Estado</th>
                <th className="border p-2 text-left">Destacado</th>
                <th className="border p-2 text-left">Categoría</th>
                <th className="border p-2 text-left">Artesano</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id_producto} className="hover:bg-gray-100">
                  <td className="border p-2">{p.nombre}</td>
                  <td className="border p-2">${p.precio}</td>
                  <td className="border p-2">{p.estado}</td>
                  <td className="border p-2">{p.destacado ? 'Sí' : 'No'}</td>
                  <td className="border p-2">{p.nombre_categoria}</td>
                  <td className="border p-2">{p.nombre_artesano} {p.apellido_artesano}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id_producto)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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

export default ProductosPage;

