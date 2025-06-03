const pool = require('../config/db');

// ✅ LISTAR artesanos (público)
exports.getArtesanos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM Artesano`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ msg: 'Error obteniendo artesanos' });
  }
};

// ✅ CREAR artesano (solo admin)
exports.createArtesano = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { nombre, apellido, telefono, email, descripcion, imagen_perfil, ubicacion } = req.body;

  try {
    await pool.query(
      `INSERT INTO Artesano (nombre, apellido, telefono, email, descripcion, imagen_perfil, ubicacion)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono, email, descripcion, imagen_perfil, ubicacion]
    );
    res.status(201).json({ msg: 'Artesano creado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error creando artesano' });
  }
};

// ✅ EDITAR artesano (solo admin)
exports.updateArtesano = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;
  const { nombre, apellido, telefono, email, descripcion, imagen_perfil, ubicacion } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE Artesano SET nombre = ?, apellido = ?, telefono = ?, email = ?, descripcion = ?, imagen_perfil = ?, ubicacion = ?
       WHERE id_artesano = ?`,
      [nombre, apellido, telefono, email, descripcion, imagen_perfil, ubicacion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Artesano no encontrado' });
    }

    res.json({ msg: 'Artesano actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error actualizando artesano' });
  }
};

// ✅ ELIMINAR artesano (solo admin)
exports.deleteArtesano = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM Artesano WHERE id_artesano = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Artesano no encontrado' });
    }

    res.json({ msg: 'Artesano eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error eliminando artesano' });
  }
};
