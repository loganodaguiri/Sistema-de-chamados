const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

const dashboardController = require('../controllers/dashboardController');

router.get('/status', authenticateToken, dashboardController.buscarQuantidadePorStatus);
router.get('/recentes', authenticateToken, dashboardController.buscarChamadosRecentes);
router.get('/por-mes', authenticateToken, dashboardController.buscarQuantidadePorMes);
router.get('/categorias', authenticateToken, dashboardController.categoriasMaisRecorrentes);

module.exports = router;
