import React, { useEffect, useState } from 'react';

const getToken = () => localStorage.getItem('token');

const AdminProductos = () => {
    const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [artesanos, setArtesanos] = useState([]);
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
  const [error, setError] = useState('');
// Cargar productos, categorías y artesanos
 const fetchProductos = async () => {
  try {
    const res = await fetch('http://localhost:4000/api/admin/productos');
    const data = await res.json();
    setProductos(data);
  } catch {
    console.error('Error cargando productos');
  }
};
useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchArtesanos();
  }, []);
const fetchCategorias = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/categorias');
      const data = await res.json();
      setCategorias(data);
    } catch {
      console.error('Error cargando categorías');
    }
  };

  const fetchArtesanos = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/artesanos');
      const data = await res.json();
      setArtesanos(data);
    } catch {
      console.error('Error cargando artesanos');
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, imagen: reader.result })); // guarda base64
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const url = editing
      ? `http://localhost:4000/api/productos/${form.id_producto}`
      : 'http://localhost:4000/api/productos';
    const method = editing ? 'PUT' : 'POST';

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
      if (!res.ok) throw new Error(data.msg);

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
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (producto) => {
    setForm(producto);
    setEditing(true);
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
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;

    try {
      const res = await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      await fetchProductos();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">CRUD de Productos</h1>

      {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-xl mb-4">{editing ? 'Editar Producto' : 'Crear Producto'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="p-2 border rounded" required />
          <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="p-2 border rounded" required />
          <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} className="p-2 border rounded" required />
          
          {/* Imagen */}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="p-2 border rounded" />
          {form.imagen && <img src={form.imagen} alt="Preview" className="w-24 h-24 object-cover rounded" />}

          {/* Select dinámico de categoría */}
          <select name="id_categoria" value={form.id_categoria} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">Seleccionar Categoría</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre_categoria}
              </option>
            ))}
          </select>

          {/* Select dinámico de artesano */}
          <select name="id_artesano" value={form.id_artesano} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">Seleccionar Artesano</option>
            {artesanos.map(a => (
              <option key={a.id_artesano} value={a.id_artesano}>
                {a.nombre} {a.apellido}
              </option>
            ))}
          </select>

          {/* Estado y destacado */}
          <select name="estado" value={form.estado} onChange={handleChange} className="p-2 border rounded">
            <option value="Disponible">Disponible</option>
            <option value="Agotado">Agotado</option>
          </select>

          <label className="flex items-center space-x-2">
            <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} />
            <span>¿Destacado?</span>
          </label>
        </div>

        <div className="mt-4 flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editing ? 'Actualizar' : 'Crear'}
          </button>
          {editing && (
            <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* TABLA */}
      <div>
        <h2 className="text-2xl mb-4">Lista de Productos</h2>
        {productos.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Precio</th>
                <th className="border p-2">Artesano</th>
                <th className="border p-2">Categoría</th>
                <th className="border p-2">Estado</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(prod => (
                <tr key={prod.id_producto} className="hover:bg-gray-100">
                  <td className="border p-2">{prod.nombre}</td>
                  <td className="border p-2">${prod.precio}</td>
                  <td className="border p-2">{prod.nombre_artesano} {prod.apellido_artesano}</td>
                  <td className="border p-2">{prod.nombre_categoria}</td>
                  <td className="border p-2">{prod.estado}</td>
                  <td className="border p-2 text-center space-x-2">
                    <button onClick={() => startEdit(prod)} className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500">Editar</button>
                    <button onClick={() => handleDelete(prod.id_producto)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
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

export default AdminProductos;