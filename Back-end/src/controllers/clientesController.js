const { criarCliente: criarClienteService, buscarClientePorCpf, buscarClientePorEmail, buscarClientePorTelefone, listarClientes, setDataFimCliente, atualizarClienteService, getClientePorIdService } = require('../services/clientesService');

const criarCliente = async (req, res) => {
    try {
        const {
            nome,
            cpf,
            email,
            telefone,
            empresa,
            cargo,
            endereco,
            cidade,
            estado,
            cep,
            observacoes
        } = req.body;

        if (!nome || !cpf) {
            return res.status(400).json({ message: 'Nome e CPF são obrigatórios.' });
        }

        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            return res.status(400).json({ message: 'CPF inválido. Use o formato 000.000.000-00' });
        }

        const criado_por = req.user.id; // ID do usuário logado

        // Verificar se CPF já existe
        const clienteExistenteCpf = await buscarClientePorCpf(cpf);
        if (clienteExistenteCpf) {
            return res.status(400).json({ message: 'Já existe um cliente com este CPF.' });
        }

        // Verificar se email já existe (se preenchido)
        if (email) {
            const clienteExistenteEmail = await buscarClientePorEmail(email);
            if (clienteExistenteEmail) {
                return res.status(400).json({ message: 'Já existe um cliente com este email.' });
            }
        }

        // Verificar se telefone já existe (se preenchido)
        if (telefone) {
            const clienteExistenteTelefone = await buscarClientePorTelefone(telefone);
            if (clienteExistenteTelefone) {
                return res.status(400).json({ message: 'Já existe um cliente com este telefone.' });
            }
        }

        // Criar cliente
        const cliente = await criarClienteService({
            nome, cpf, email, telefone, empresa, cargo,
            endereco, cidade, estado, cep, observacoes, criado_por
        });

        res.status(201).json({ message: 'Cliente criado com sucesso', cliente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
    }
};


const getClientes = async (req, res) => {
    try {
        const clientes = await listarClientes();
        res.json({ clientes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar clientes", error: err.message });
    }
};

const excluirCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await setDataFimCliente(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.status(200).json({ message: 'Cliente excluído com sucesso', cliente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir cliente', error: error.message });
    }
};

// Buscar cliente por ID
const getClientePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await getClientePorIdService(id);
        if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
        res.json(cliente);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao buscar cliente" });
    }
};

// Atualizar cliente
const atualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const clienteAtualizado = await atualizarClienteService(id, req.body);
        res.json({ cliente: clienteAtualizado });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao atualizar cliente" });
    }
};

module.exports = {
    criarCliente,
    listarClientes,
    getClientePorId,
    getClientes,
    atualizarCliente,
    excluirCliente
};
