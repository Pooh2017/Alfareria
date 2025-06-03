const pool = require('../config/db');

// ✅ LISTAR productos
exports.getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre_categoria, a.nombre AS nombre_artesano, a.apellido AS apellido_artesano
       FROM Producto p
       LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
       LEFT JOIN Artesano a ON p.id_artesano = a.id_artesano`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ msg: 'Error obteniendo productos' });
  }
};

// ✅ CREAR producto
exports.createProducto = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { nombre, descripcion, precio, imagen, estado, destacado, id_categoria, id_artesano } = req.body;
  try {
    await pool.query(
      `INSERT INTO Producto (nombre, descripcion, precio, imagen, estado, destacado, id_categoria, id_artesano) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, imagen, estado || 'Disponible', destacado || false, id_categoria, id_artesano]
    );
    res.status(201).json({ msg: 'Producto creado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error creando producto' });
  }
};


// ✅ EDITAR producto (solo admin)
exports.updateProducto = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;
  const { nombre, descripcion, precio, imagen, estado, destacado, id_categoria, id_artesano } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE Producto SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, estado = ?, destacado = ?, id_categoria = ?, id_artesano = ?
       WHERE id_producto = ?`,
      [nombre, descripcion, precio, imagen, estado, destacado, id_categoria, id_artesano, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    res.json({ msg: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error actualizando producto' });
  }
};

// ✅ ELIMINAR producto (solo admin)
exports.deleteProducto = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM Producto WHERE id_producto = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    res.json({ msg: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error eliminando producto' });
  }
};
