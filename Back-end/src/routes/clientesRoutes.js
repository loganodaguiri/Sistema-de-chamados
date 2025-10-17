const express = require('express');
const router = express.Router();
const {
    criarCliente,
    getClientePorId,
    atualizarCliente,
    getClientes,
    excluirCliente
} = require('../controllers/clientesController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, criarCliente);
router.get('/', authenticateToken, getClientes);
router.delete('/:id', authenticateToken, excluirCliente);
router.get('/:id', authenticateToken, getClientePorId); // Buscar cliente por ID
router.put('/:id', authenticateToken, atualizarCliente);

module.exports = router;
