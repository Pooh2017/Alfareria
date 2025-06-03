const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const verificarAuth = require('../middleware/authMiddleware');


router.get('/', productoController.getProductos);
router.post('/', verificarAuth, productoController.createProducto);
router.put('/:id', verificarAuth, productoController.updateProducto);
router.delete('/:id', verificarAuth, productoController.deleteProducto);

module.exports = router;
