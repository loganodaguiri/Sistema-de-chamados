const {
    criarChamadoService,
    getChamadosService,
    getChamadoPorIdService,
    atualizarChamadoService,
    excluirChamadoService
} = require('../services/chamadosService');
const { getUsuarioPorIdService } = require('../services/userService');

// Criar chamado
const criarChamado = async (req, res) => {
    try {
        const { cliente_id, categoria, prioridade, titulo, descricao, responsavel_id } = req.body;
        const anexo = req.file ? req.file.filename : null;

        if (!cliente_id || !categoria || !prioridade || !titulo || !responsavel_id) {
            return res.status(400).json({ message: 'Cliente, categoria, prioridade, título e responsável são obrigatórios.' });
        }

        const usuarioResponsavel = await getUsuarioPorIdService(responsavel_id);
        if (!usuarioResponsavel) {
            return res.status(404).json({ message: 'Responsável não encontrado.' });
        }
        if (!usuarioResponsavel.is_admin) {
            return res.status(400).json({ message: 'O responsável precisa ser um usuário administrador.' });
        }

        const chamado = await criarChamadoService({
            cliente_id,
            categoria,
            prioridade,
            titulo,
            descricao,
            anexo,
            responsavel_id
        });

        res.status(201).json({ message: 'Chamado criado com sucesso', chamado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar chamado', error: error.message });
    }
};

// Listar todos os chamados
const getChamados = async (req, res) => {
    try {
        const chamados = await getChamadosService();
        res.json({ chamados });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar chamados", error: err.message });
    }
};

// Buscar chamado por ID
const getChamadoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const chamado = await getChamadoPorIdService(id);
        if (!chamado) return res.status(404).json({ message: "Chamado não encontrado" });
        res.json(chamado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar chamado", error: err.message });
    }
};

// Atualizar chamado
const atualizarChamado = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = { ...req.body };

        if (req.file) dados.anexo = req.file.filename;

        const chamadoAtualizado = await atualizarChamadoService(id, dados);

        if (chamadoAtualizado === null) {
            return res.status(404).json({ message: "Chamado não encontrado." });
        }

        if (chamadoAtualizado === "nao-alterado") {
            return res.status(400).json({ message: "Nenhuma alteração detectada no chamado." });
        }

        res.json({ chamado: chamadoAtualizado });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao atualizar chamado", error: err.message });
    }
};


// Excluir chamado
const excluirChamado = async (req, res) => {
    try {
        const { id } = req.params;
        const chamado = await excluirChamadoService(id);
        if (!chamado) return res.status(404).json({ message: 'Chamado não encontrado' });
        res.status(200).json({ message: 'Chamado excluído com sucesso', chamado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir chamado', error: error.message });
    }
};

module.exports = {
    criarChamado,
    getChamados,
    getChamadoPorId,
    atualizarChamado,
    excluirChamado
};
