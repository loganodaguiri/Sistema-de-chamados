const db = require('../db'); // Supondo que você tenha um arquivo de conexão com o banco

// Criar chamado
const criarChamadoService = async ({
                                       cliente_id,
                                       categoria,
                                       prioridade,
                                       titulo,
                                       descricao,
                                       anexo,
                                       responsavel_id,
                                   }) => {
    const query = `
        INSERT INTO chamados (
            cliente_id,
            categoria,
            prioridade,
            responsavel_id,
            titulo,
            descricao,
            anexo,
            status,
            data_criacao,
            data_atualizacao
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            RETURNING *;
    `;

    const values = [
        cliente_id,
        categoria,
        prioridade,
        responsavel_id,
        titulo,
        descricao || null,
        anexo || null,
        'aberto',
    ];
    const result = await db.query(query, values);
    return result.rows[0];
};

// Listar todos os chamados
const getChamadosService = async () => {
    const query = `
        SELECT
            c.id,
            c.cliente_id,
            c.categoria,
            c.prioridade,
            c.responsavel_id,
            c.titulo,
            c.descricao,
            c.anexo,
            c.status,
            c.data_criacao,
            c.data_atualizacao,
            cli.nome AS cliente_nome,
            u.nome AS responsavel_nome
        FROM chamados c
                 LEFT JOIN clientes cli ON c.cliente_id = cli.id
                 LEFT JOIN usuarios u ON c.responsavel_id = u.id
        ORDER BY c.data_criacao DESC;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Buscar chamado por ID
const getChamadoPorIdService = async (id) => {
    const query = `
        SELECT c.*, cli.nome AS cliente_nome, u.nome AS responsavel_nome
        FROM chamados c
        LEFT JOIN clientes cli ON c.cliente_id = cli.id
        LEFT JOIN usuarios u ON c.responsavel_id = u.id
        WHERE c.id = $1;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

// Atualizar chamado
const atualizarChamadoService = async (id, dados) => {
    // Remove campos undefined ou vazios
    const dadosValidos = {};
    for (const key in dados) {
        if (dados[key] !== undefined && dados[key] !== null && dados[key] !== "") {
            dadosValidos[key] = dados[key];
        }
    }

    // Se não houver nenhum campo válido, não atualiza
    if (Object.keys(dadosValidos).length === 0) return null;

    // Busca o chamado atual para comparar
    const queryAtual = `SELECT * FROM chamados WHERE id = $1`;
    const resultAtual = await db.query(queryAtual, [id]);
    const chamadoAtual = resultAtual.rows[0];

    if (!chamadoAtual) return null;

    // Verifica se algum valor mudou
    let alterou = false;
    for (const key in dadosValidos) {
        if (dadosValidos[key] != chamadoAtual[key]) {
            alterou = true;
            break;
        }
    }

    if (!alterou) return "nao-alterado"; // Nenhuma alteração detectada

    // Monta a query de atualização
    const campos = [];
    const valores = [];
    let index = 1;

    for (let key in dadosValidos) {
        campos.push(`${key} = $${index}`);
        valores.push(dadosValidos[key]);
        index++;
    }

    const query = `
        UPDATE chamados
        SET ${campos.join(", ")}, data_atualizacao = NOW()
        WHERE id = $${index}
        RETURNING *;
    `;
    valores.push(id);

    const result = await db.query(query, valores);
    return result.rows[0];
};

// Excluir chamado
const excluirChamadoService = async (id) => {
    const query = `
        UPDATE chamados
        SET data_fim = NOW()
        WHERE id = $1
        RETURNING *;
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
};

const criarRespostaService = async (chamadoId, usuarioId, mensagem) => {
    const chamado = await getChamadoPorIdService(chamadoId);
    if (!chamado) return null;

    const query = `
        INSERT INTO respostas_chamados (
            chamado_id,
            usuario_id,
            mensagem,
            data_criacao
        )
        VALUES ($1, $2, $3, NOW())
        RETURNING *;
    `;
    const values = [chamadoId, usuarioId, mensagem];
    const result = await db.query(query, values);
    return result.rows[0];
};

const listarRespostasService = async (chamadoId) => {
    // Retorna todas as respostas de um chamado, incluindo nome do usuário
    const respostas = await db.query(
        `SELECT r.id, r.mensagem, r.data_criacao AS "createdAt", u.nome AS "usuarioNome"
         FROM respostas_chamados r
                  JOIN usuarios u ON r.usuario_id = u.id
         WHERE r.chamado_id = $1
         ORDER BY r.data_criacao ASC`,
        [chamadoId]
    );
    return respostas.rows;
};

const salvarAvaliacaoService = async ({ chamadoId, usuarioId, comentario, estrelas }) => {
    const query = `
        INSERT INTO chamado_avaliacoes (chamado_id, usuario_id, comentario, estrelas, data_criacao)
        VALUES ($1, $2, $3, $4, NOW())
            RETURNING *;
    `;

    const values = [chamadoId, usuarioId, comentario, estrelas];
    const result = await db.query(query, values);
    return result.rows[0];
};

const buscarAvaliacaoService = async (chamadoId) => {
    const query = `
    SELECT * FROM chamado_avaliacoes
    WHERE chamado_id = $1
    LIMIT 1;
  `;
    const result = await db.query(query, [chamadoId]);
    return result.rows[0];
};

module.exports = {
    criarChamadoService,
    getChamadosService,
    getChamadoPorIdService,
    atualizarChamadoService,
    excluirChamadoService,
    criarRespostaService,
    listarRespostasService,
    salvarAvaliacaoService,
    buscarAvaliacaoService
};
