const pool = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ LISTAR usuarios (solo admin)
exports.getUsuarios = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  try {
    const [rows] = await pool.query(`SELECT id_usuario, nombre, apellido, correo, rol, telefono, fecha_registro FROM Usuario`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ msg: 'Error obteniendo usuarios' });
  }
};

// ✅ CREAR usuario (solo admin)
exports.createUsuario = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { nombre, apellido, correo, contraseña, rol, telefono } = req.body;

  try {
    // Verificar si ya existe el correo
    const [existing] = await pool.query(`SELECT id_usuario FROM Usuario WHERE correo = ?`, [correo]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'El correo ya está registrado' });
    }

    // Cifrar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    await pool.query(
      `INSERT INTO Usuario (nombre, apellido, correo, contraseña, rol, telefono) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, hashedPassword, rol, telefono]
    );

    res.status(201).json({ msg: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error creando usuario' });
  }
};

// ✅ ACTUALIZAR usuario (solo admin y no puede editarse a sí mismo)
exports.updateUsuario = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;
  const { nombre, apellido, correo, contraseña, rol, telefono } = req.body;

  if (parseInt(id) === req.user.id_usuario) {
    return res.status(403).json({ msg: 'No puedes editar tu propio usuario' });
  }

  try {
    // Verificar si el nuevo correo ya existe en otro usuario
    const [existing] = await pool.query(
      `SELECT id_usuario FROM Usuario WHERE correo = ? AND id_usuario != ?`,
      [correo, id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'El correo ya está en uso por otro usuario' });
    }

    // Cifrar contraseña si se envía
    const hashedPassword = contraseña ? await bcrypt.hash(contraseña, 10) : undefined;

    const [result] = await pool.query(
      `UPDATE Usuario 
       SET nombre = ?, apellido = ?, correo = ?, ${hashedPassword ? 'contraseña = ?,' : ''} rol = ?, telefono = ?
       WHERE id_usuario = ?`,
      hashedPassword
        ? [nombre, apellido, correo, hashedPassword, rol, telefono, id]
        : [nombre, apellido, correo, rol, telefono, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error actualizando usuario' });
  }
};

// ✅ ELIMINAR usuario (solo admin y no puede eliminarse a sí mismo)
exports.deleteUsuario = async (req, res) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado: solo administradores' });
  }

  const { id } = req.params;

  if (parseInt(id) === req.user.id_usuario) {
    return res.status(403).json({ msg: 'No puedes eliminar tu propio usuario' });
  }

  try {
    const [result] = await pool.query(`DELETE FROM Usuario WHERE id_usuario = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error eliminando usuario' });
  }
};
