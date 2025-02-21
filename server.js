const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const dotenv = require('dotenv');
const prestadoresRoutes = require('./routes/prestadores');

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB (sem opções obsoletas)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prestadorServicos')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(helmet()); // Adiciona headers de segurança
app.use(bodyParser.json({ limit: '50kb' })); // Limita o tamanho do payload
app.use(cors()); // Habilita CORS

// Rotas
app.use('/api/prestadores', prestadoresRoutes);

// Tratamento de erros do Celebrate
app.use(errors());

// Middleware de erro global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado!' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});