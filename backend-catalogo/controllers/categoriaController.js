const pool = require('../config/db');

// ✅ LISTAR categorías (disponible para cualquier usuario autenticado)
exports.getCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Categoria');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ msg: 'Error obteniendo categorías' });
  }
};

// ✅ CREAR categoría (solo admin)
exports.createCategoria = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { nombre_categoria } = req.body;

  if (!nombre_categoria) {
    return res.status(400).json({ msg: 'El nombre de la categoría es obligatorio' });
  }

  try {
    await pool.query(
      'INSERT INTO Categoria (nombre_categoria) VALUES (?)',
      [nombre_categoria]
    );
    res.status(201).json({ msg: 'Categoría creada correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error creando categoría' });
  }
};

// ✅ EDITAR categoría (solo admin)
exports.updateCategoria = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;
  const { nombre_categoria } = req.body;

  if (!nombre_categoria) {
    return res.status(400).json({ msg: 'El nombre de la categoría es obligatorio' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Categoria SET nombre_categoria = ? WHERE id_categoria = ?',
      [nombre_categoria, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    res.json({ msg: 'Categoría actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error actualizando categoría' });
  }
};

// ✅ ELIMINAR categoría (solo admin)
exports.deleteCategoria = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM Categoria WHERE id_categoria = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Categoría no encontrada' });
    }

    res.json({ msg: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error eliminando categoría' });
  }
};
