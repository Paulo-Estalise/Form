const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const dotenv = require('dotenv');
const path = require('path'); // Adicionado para servir arquivos estáticos
const prestadoresRoutes = require('./routes/prestadores');

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prestadorServicos')
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(helmet()); // Adiciona headers de segurança para proteger a aplicação
app.use(bodyParser.json({ limit: '50kb' })); // Limita o tamanho do payload para 50kb
app.use(cors({
    origin: 'https://form-flame-seven.vercel.app', // Permite apenas requisições do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
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
    console.error('Erro global:', err.stack); // Log do erro no console
    res.status(500).json({ message: 'Algo deu errado no servidor!' }); // Resposta ao cliente
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});