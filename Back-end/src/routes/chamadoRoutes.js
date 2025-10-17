const express = require('express');
const router = express.Router();
const { criarChamado, getChamados, getChamadoPorId, atualizarChamado, excluirChamado } = require('../controllers/chamadosController');
const authenticateToken = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Rotas
router.post('/', authenticateToken, upload.single('anexo'), criarChamado);
router.get('/', authenticateToken, getChamados);
router.get('/:id', authenticateToken, getChamadoPorId);
router.put("/:id", authenticateToken, upload.single("anexo"), atualizarChamado);
router.delete('/:id', authenticateToken, excluirChamado);

module.exports = router;
