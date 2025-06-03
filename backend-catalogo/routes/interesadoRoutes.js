const express = require('express');
const router = express.Router();
const interesadoController = require('../controllers/interesadoController');
const verificarAuth = require('../middleware/authMiddleware');

// Ruta pública (página de contacto)
router.post('/', interesadoController.createInteresado);

// Rutas protegidas para el admin
router.get('/', verificarAuth, interesadoController.getInteresados);
router.get('/:id', verificarAuth, interesadoController.getInteresadoById);
router.delete('/:id', verificarAuth, interesadoController.deleteInteresado);

module.exports = router;
