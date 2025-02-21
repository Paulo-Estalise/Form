const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB (sem opções obsoletas)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prestadorServicos')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Schema e Modelo do Mongoose
const prestadorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    client: { type: String, required: true },
    phone: { type: String, required: true },
    budget: { type: Number, required: true },
    items: [{
        item: { type: String, required: true },
        area: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
});

const Prestador = mongoose.model('Prestador', prestadorSchema);

// Middlewares
app.use(helmet()); // Adiciona headers de segurança
app.use(bodyParser.json({ limit: '50kb' })); // Limita o tamanho do payload
app.use(cors()); // Habilita CORS

// Rota para cadastrar prestador
app.post('/api/prestadores', celebrate({
    body: Joi.object({
        name: Joi.string().required(),
        city: Joi.string().required(),
        client: Joi.string().required(),
        phone: Joi.string().required(),
        budget: Joi.number().required(),
        items: Joi.array().items(Joi.object({
            item: Joi.string().required(),
            area: Joi.number().required(),
            price: Joi.number().required(),
        })).required(),
    }),
}), async (req, res, next) => {
    try {
        const newPrestador = new Prestador(req.body);
        await newPrestador.save();
        res.status(201).json({ message: 'Prestador cadastrado com sucesso!' });
    } catch (err) {
        next(err);
    }
});

// Rota para listar cidades
app.get('/api/prestadores/cidades', async (req, res, next) => {
    try {
        const cidades = await Prestador.distinct('city');
        res.status(200).json(cidades.length ? cidades : { message: 'Nenhuma cidade cadastrada.' });
    } catch (err) {
        next(err);
    }
});

// Rota para listar todos os prestadores
app.get('/api/prestadores', async (req, res, next) => {
    try {
        const prestadores = await Prestador.find({});
        res.status(200).json(prestadores.length ? prestadores : { message: 'Nenhum prestador cadastrado.' });
    } catch (err) {
        next(err);
    }
});

// Rota para deletar prestador
app.delete('/api/prestadores/:id', async (req, res, next) => {
    try {
        const prestador = await Prestador.findByIdAndDelete(req.params.id);
        res.status(200).json(prestador ? { message: 'Prestador deletado com sucesso!' } : { message: 'Prestador não encontrado.' });
    } catch (err) {
        next(err);
    }
});

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