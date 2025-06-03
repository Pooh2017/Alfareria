const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const artesanoController = require('../controllers/artesanoController');

// Ruta pública para listar artesanos
router.get('/', artesanoController.getArtesanos);

// Rutas protegidas para admin
router.post('/', verifyToken, artesanoController.createArtesano);
router.put('/:id', verifyToken, artesanoController.updateArtesano);
router.delete('/:id', verifyToken, artesanoController.deleteArtesano);

module.exports = router;
