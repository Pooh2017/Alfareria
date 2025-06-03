const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const verificarAuth = require('../middleware/authMiddleware');

router.get('/', verificarAuth, usuarioController.getUsuarios);
router.post('/', verificarAuth, usuarioController.createUsuario);
router.put('/:id', verificarAuth, usuarioController.updateUsuario);
router.delete('/:id', verificarAuth, usuarioController.deleteUsuario);

module.exports = router;
