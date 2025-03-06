const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const dotenv = require('dotenv');
const path = require('path'); // Para servir arquivos estáticos
const prestadoresRoutes = require('./routes/prestadores');

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000; // Porta 4000

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prestadorServicos')
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(helmet()); // Adiciona headers de segurança
app.use(bodyParser.json({ limit: '50kb' })); // Limita o tamanho do payload
app.use(cors({
    origin: ['http://localhost:4000', 'http://127.0.0.1:5500'], // Adicionando a origem do Live Server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Serve arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Rota padrão para o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas da API
app.use('/api/prestadores', prestadoresRoutes);

// Tratamento de erros do Celebrate (validação de dados)
app.use(errors());

// Middleware de erro global
app.use((err, req, res, next) => {
    console.error('Erro global:', {
        message: err.message, // Mensagem do erro
        stack: err.stack,    // Stack trace do erro
        body: req.body,      // Corpo da requisição
        params: req.params,  // Parâmetros da requisição
        query: req.query     // Query da requisição
    });
    res.status(500).json({ message: 'Algo deu errado no servidor!' }); // Resposta ao cliente
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});