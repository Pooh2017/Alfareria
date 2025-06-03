const pool = require('../config/db');

// ✅ Crear nuevo mensaje (público)
exports.createInteresado = async (req, res) => {
  const { nombre, email, mensaje, id_producto } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios (nombre, email, mensaje)' });
  }

  try {
    await pool.query(
      `INSERT INTO Interesado (nombre, email, mensaje, id_producto) VALUES (?, ?, ?, ?)`,
      [nombre, email, mensaje, id_producto || null]
    );
    res.status(201).json({ msg: 'Mensaje enviado con éxito. Gracias por tu interés.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al enviar mensaje' });
  }
};

// ✅ Obtener todos los mensajes (solo admin)
exports.getInteresados = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT i.*, p.nombre AS nombre_producto 
       FROM Interesado i
       LEFT JOIN Producto p ON i.id_producto = p.id_producto
       ORDER BY i.fecha_contacto DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los mensajes' });
  }
};

// ✅ Obtener mensaje por ID (solo admin)
exports.getInteresadoById = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT * FROM Interesado WHERE id_interesado = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Mensaje no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener el mensaje' });
  }
};

// ✅ Eliminar mensaje (solo admin)
exports.deleteInteresado = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;

  try {
    const [result] = await pool.query(
      `DELETE FROM Interesado WHERE id_interesado = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Mensaje no encontrado' });
    }

    res.json({ msg: 'Mensaje eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el mensaje' });
  }
};
