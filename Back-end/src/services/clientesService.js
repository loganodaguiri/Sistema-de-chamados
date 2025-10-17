const db = require('../db'); // seu arquivo de conexão com o banco

// Criar cliente
const criarCliente = async (clienteData) => {
    const {
        nome, cpf, email, telefone,
        empresa, cargo, endereco, cidade,
        estado, cep, observacoes, criado_por
    } = clienteData;

    const query = `
        INSERT INTO clientes
            (nome, cpf, email, telefone, empresa, cargo, endereco, cidade, estado, cep, observacoes, criado_por)
        VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *;
    `;

    const values = [nome, cpf, email, telefone, empresa, cargo, endereco, cidade, estado, cep, observacoes, criado_por];

    const { rows } = await db.query(query, values);
    return rows[0];
};

// Buscar cliente por CPF
const buscarClientePorCpf = async (cpf) => {
    const query = `SELECT * FROM clientes WHERE cpf = $1;`;
    const { rows } = await db.query(query, [cpf]);
    return rows[0] || null;
};

// Buscar cliente por Email
const buscarClientePorEmail = async (email) => {
    const query = `SELECT * FROM clientes WHERE email = $1;`;
    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
};

// Buscar cliente por Telefone
const buscarClientePorTelefone = async (telefone) => {
    const query = `SELECT * FROM clientes WHERE telefone = $1;`;
    const { rows } = await db.query(query, [telefone]);
    return rows[0] || null;
};

const listarClientes = async () => {
    const query = `
        SELECT id, nome, cpf, email, telefone, empresa
        FROM clientes
        WHERE data_fim IS NULL
        ORDER BY nome;
    `;
    const { rows } = await db.query(query);
    return rows;
};

const setDataFimCliente = async (id) => {
    const query = `
    UPDATE clientes
    SET data_fim = NOW()
    WHERE id = $1
    RETURNING *;
  `;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
};

// Buscar cliente por ID
const getClientePorIdService = async (id) => {
    const { rows } = await db.query(`
    SELECT * FROM clientes WHERE id = $1 AND data_fim IS NULL
  `, [id]);
    return rows[0] || null;
};

// Atualizar cliente
const atualizarClienteService = async (id, clienteData) => {
    const {
        nome, cpf, email, telefone,
        empresa, cargo, endereco, cidade,
        estado, cep, observacoes
    } = clienteData;

    const query = `
    UPDATE clientes SET
      nome=$1, cpf=$2, email=$3, telefone=$4,
      empresa=$5, cargo=$6, endereco=$7, cidade=$8,
      estado=$9, cep=$10, observacoes=$11
    WHERE id=$12
    RETURNING *;
  `;
    const values = [nome, cpf, email, telefone, empresa, cargo, endereco, cidade, estado, cep, observacoes, id];
    const { rows } = await db.query(query, values);
    return rows[0];
};

module.exports = {
    criarCliente,
    buscarClientePorCpf,
    buscarClientePorEmail,
    buscarClientePorTelefone,
    listarClientes,
    setDataFimCliente,
    atualizarClienteService,
    getClientePorIdService
};
