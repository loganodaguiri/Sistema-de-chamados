const express = require('express');
const router = express.Router();
const { registerUser, loginUser, listarUsuariosAdmins } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/admins', authenticateToken, listarUsuariosAdmins);

module.exports = router;
