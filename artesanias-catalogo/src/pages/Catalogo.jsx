import React, { useEffect, useState } from 'react';
import './Catalogo.css';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar los productos');
        return res.json();
      })
      .then(data => setProductos(data))
      .catch(err => {
        console.error('Error:', err);
        setError('No se pudieron cargar las artesanías.');
      });
  }, []);

  return (
    <div className="catalogo-container">
      <h2>Catálogo de Artesanías</h2>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="catalogo-grid">
        {productos.map((item) => (
          <div key={item.id_producto} className="artesania-card">
            <img
              src={item.imagen?.startsWith('data:') ? item.imagen : `http://localhost:4000/${item.imagen}`}
              alt={item.nombre}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h3>{item.nombre}</h3>
            <p className="descripcion">{item.descripcion}</p>
            <p><strong>Precio:</strong> ${item.precio}</p>
            <p><strong>Artesano:</strong> {item.nombre_artesano} {item.apellido_artesano}</p>
            <p><strong>Estado:</strong> {item.estado}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;