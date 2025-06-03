const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  console.log('BODY RECIBIDO EN LOGIN:', req.body);
  const { correo, contraseña } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }
    const token = jwt.sign(
      { id_usuario: user.id_usuario, rol: user.rol ,nombre: user.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ token, user: { id_usuario: user.id_usuario, nombre: user.nombre, rol: user.rol } });
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

exports.register = async (req, res) => {
  const { nombre, apellido, correo, contraseña } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM Usuario WHERE correo = ?', [correo]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'Correo ya registrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    await pool.query(
      'INSERT INTO Usuario (nombre, apellido, correo, contraseña, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, correo, hashedPassword, 'visitante']
    );
    res.status(201).json({ msg: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};
