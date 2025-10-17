const db = require('../db');
const bcrypt = require('bcrypt');

const createUser = async ({ nome, sobrenome, email, senha }) => {
    const senhaHash = await bcrypt.hash(senha, 10);

    const query = `
    INSERT INTO usuarios (nome, sobrenome, email, senha)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nome, sobrenome, email, is_admin, created_at;
  `;

    const values = [nome, sobrenome, email, senhaHash];

    const { rows } = await db.query(query, values);
    return rows[0];
};

const getUsuariosAdminsService = async () => {
    const query = 'SELECT id, nome, email FROM usuarios WHERE is_admin = true';
    const result = await db.query(query);
    return result.rows; // retorna lista de usuários admins
};

const getUsuarioPorIdService = async (id) => {
    const query = `SELECT * FROM usuarios WHERE id = $1;`;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

module.exports = { createUser, getUsuariosAdminsService, getUsuarioPorIdService };
