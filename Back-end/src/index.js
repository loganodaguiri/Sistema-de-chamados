const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const userRoutes = require('./routes/userRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const chamadosRoutes = require('./routes/chamadoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use('/users', userRoutes);
app.use('/clientes', clientesRoutes);
app.use('/chamados', chamadosRoutes);

// função para testar conexão com o banco
async function testDBConnection() {
    try {
        const res = await db.query('SELECT NOW()');
        console.log('Conexão com o DB OK:', res.rows);
    } catch (err) {
        console.error('Erro ao conectar com o banco de dados:', err);
        process.exit(1);
    }
}

// iniciar servidor após verificar conexão com o banco
async function startServer() {
    await testDBConnection();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

startServer();
