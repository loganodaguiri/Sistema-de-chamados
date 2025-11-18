const db = require('../db');

const buscarQuantidadePorStatus = async () => {
    const query = `
        SELECT status, COUNT(*) AS total
        FROM chamados
        WHERE status IN ('aberto', 'em_progresso', 'resolvido', 'fechado')
        GROUP BY status;
    `;

    const { rows } = await db.query(query);

    return {
        aberto: rows.find(r => r.status === 'aberto')?.total || 0,
        emProgresso: rows.find(r => r.status === 'em_progresso')?.total || 0,
        resolvido: rows.find(r => r.status === 'resolvido')?.total || 0,
        fechado: rows.find(r => r.status === 'fechado')?.total || 0
    };
};

// Buscar os chamados mais recentes
const buscarChamadosRecentes = async () => {
    const query = `
        SELECT
            id,
            cliente_id,
            categoria,
            prioridade,
            responsavel_id,
            titulo,
            descricao,
            anexo,
            status,
            data_criacao,
            data_atualizacao,
            data_fim
        FROM chamados
        ORDER BY data_atualizacao DESC
            LIMIT 5;
    `;

    const { rows } = await db.query(query);
    return rows;
};

// Quantidade de chamados por mês no ano atual
const buscarQuantidadePorMes = async () => {
    const query = `
        SELECT 
            TO_CHAR(data_criacao, 'YYYY-MM') AS ano_mes,
            COUNT(*) AS total
        FROM chamados
        WHERE EXTRACT(YEAR FROM data_criacao) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY ano_mes
        ORDER BY ano_mes;
    `;

    const { rows } = await db.query(query);

    // Transformar em formato mais amigável para o front
    const meses = [
        "01","02","03","04","05","06",
        "07","08","09","10","11","12"
    ];

    const resultado = {};

    meses.forEach(m => {
        const item = rows.find(r => r.ano_mes.endsWith(m));
        resultado[m] = item ? parseInt(item.total) : 0;
    });

    return resultado;
};


// Categorias mais recorrentes
const categoriasMaisRecorrentes = async () => {
    const query = `
        SELECT 
            categoria,
            COUNT(*) AS total
        FROM chamados
        GROUP BY categoria
        ORDER BY total DESC
        LIMIT 5;
    `;

    const { rows } = await db.query(query);

    // Transformar em formato mais amigável
    const resultado = rows.map(r => ({
        categoria: r.categoria,
        total: parseInt(r.total)
    }));

    return resultado;
};

module.exports = {
    buscarQuantidadePorStatus,
    buscarChamadosRecentes,
    buscarQuantidadePorMes,
    categoriasMaisRecorrentes
};
