const dashboardService = require('../services/dashboardService');

const buscarQuantidadePorStatus = async (req, res) => {
    try {
        const data = await dashboardService.buscarQuantidadePorStatus();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Erro no dashboard:", error);
        return res.status(500).json({
            success: false,
            message: "Erro interno ao buscar dados do dashboard"
        });
    }
};

const buscarChamadosRecentes = async (req, res) => {
    try {
        const data = await dashboardService.buscarChamadosRecentes();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Erro ao buscar chamados recentes:", error);
        return res.status(500).json({
            success: false,
            message: "Erro interno ao buscar chamados recentes"
        });
    }
};

const buscarQuantidadePorMes = async (req, res) => {
    try {
        const data = await dashboardService.buscarQuantidadePorMes();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Erro ao buscar quantidade por mês:", error);
        return res.status(500).json({
            success: false,
            message: "Erro interno ao buscar quantidade por mês"
        });
    }
};

const categoriasMaisRecorrentes = async (req, res) => {
    try {
        const dados = await dashboardService.categoriasMaisRecorrentes();
        res.json(dados);
    } catch (error) {
        console.error("Erro ao buscar categorias recorrentes:", error);
        res.status(500).json({ error: "Erro ao buscar categorias mais recorrentes" });
    }
};

module.exports = {
    buscarQuantidadePorStatus,
    buscarChamadosRecentes,
    buscarQuantidadePorMes,
    categoriasMaisRecorrentes
};
