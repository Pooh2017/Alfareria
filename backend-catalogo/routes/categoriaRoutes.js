const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const verificarAuth = require('../middleware/authMiddleware');

// Rutas protegidas
router.get('/', verificarAuth, categoriaController.getCategorias);
router.post('/', verificarAuth, categoriaController.createCategoria);
router.put('/:id', verificarAuth, categoriaController.updateCategoria);
router.delete('/:id', verificarAuth, categoriaController.deleteCategoria);

module.exports = router;
