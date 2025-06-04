import React, { useEffect, useState } from 'react';
import '../styles/ArtesanosPage.css';

const ArtesanosPage = () => {
  const [artesanos, setArtesanos] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    descripcion: '',
    imagen_perfil: '',
    ubicacion: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulamos funciones (puedes reemplazar con las reales)
  const getToken = () => 'token-de-ejemplo';

  useEffect(() => {
    // Aquí iría tu lógica para cargar artesanos desde una API
    setLoading(false); // simula carga
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editing) {
      // lógica para actualizar
    } else {
      // lógica para crear
    }
    setForm({
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      descripcion: '',
      imagen_perfil: '',
      ubicacion: ''
    });
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      descripcion: '',
      imagen_perfil: '',
      ubicacion: ''
    });
  };

  const startEdit = (artesano) => {
    setEditing(true);
    setForm({ ...artesano });
  };

  const handleDelete = (id) => {
    // lógica para eliminar
  };

  return (
    <div className="container">
      <h1 className="title">CRUD Artesanos</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">{editing ? 'Editar Artesano' : 'Crear Artesano'}</h2>
        <div className="form-grid">
          <input name="nombre" placeholder="Nombre *" value={form.nombre} onChange={handleChange} className="input" />
          <input name="apellido" placeholder="Apellido *" value={form.apellido} onChange={handleChange} className="input" />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="input" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" />
          <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="input" />
          <input name="imagen_perfil" placeholder="URL Imagen Perfil" value={form.imagen_perfil} onChange={handleChange} className="input" />
          <input name="ubicacion" placeholder="Ubicación" value={form.ubicacion} onChange={handleChange} className="input" />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button type="submit" className="button button-primary">
            {editing ? 'Actualizar' : 'Crear'}
          </button>
          {editing && (
            <button type="button" onClick={cancelEdit} className="button button-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="form-title">Lista de Artesanos</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : artesanos.length === 0 ? (
          <p>No hay artesanos registrados.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Descripción</th>
                <th>Ubicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {artesanos.map(a => (
                <tr key={a.id_artesano} className="table-row">
                  <td>{a.nombre}</td>
                  <td>{a.apellido}</td>
                  <td>{a.telefono}</td>
                  <td>{a.email}</td>
                  <td>{a.descripcion}</td>
                  <td>{a.ubicacion}</td>
                  <td className="actions">
                    <button onClick={() => startEdit(a)} className="button button-warning">Editar</button>
                    <button onClick={() => handleDelete(a.id_artesano)} className="button button-danger">Eliminar</button>
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
