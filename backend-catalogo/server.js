const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const artesanoRoutes =require('./routes/artesanoRoutes')
const categoriaController =require('./routes/categoriaRoutes');
const interesadoController =require('./routes/interesadoRoutes')

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // <-- el puerto de tu frontend
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/artesanos', artesanoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaController);
app.use('/api/interesados', interesadoController);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
