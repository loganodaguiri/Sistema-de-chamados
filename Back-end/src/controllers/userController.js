const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Carrega o .env da raiz
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido. Configure a variável de ambiente.');
}
const { createUser, getUsuariosAdminsService } = require('../services/userService');
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');

// Registrar usuário
const registerUser = async (req, res) => {
    const { nome, sobrenome, email, senha, confirmarSenha } = req.body;

    if (!nome || !sobrenome || !email || !senha || !confirmarSenha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (senha !== confirmarSenha) {
        return res.status(400).json({ error: 'As senhas não coincidem' });
    }

    try {
        const user = await createUser({ nome, sobrenome, email, senha });
        res.status(201).json({ message: 'Usuário cadastrado com sucesso', user });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
};

// Login de usuário
const loginUser = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    try {
        const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const user = rows[0];

        if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) return res.status(401).json({ error: 'Senha incorreta' });

        // gerar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login realizado com sucesso', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
};

const listarUsuariosAdmins = async (req, res) => {
    try {
        const usuarios = await getUsuariosAdminsService();
        res.json({ usuarios });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar usuários administradores", error: err.message });
    }
};

module.exports = { registerUser, loginUser, listarUsuariosAdmins };
