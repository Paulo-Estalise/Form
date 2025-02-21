const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

const app = express();
const PORT = 3000;

// Conectar ao MongoDB (sem opções obsoletas)
mongoose.connect('mongodb://localhost:27017/prestadorServicos')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definir o Schema e o Model
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

// Middleware para segurança e parsear o corpo das requisições
app.use(helmet());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(cors());

// Rota para salvar os dados do formulário com validação
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
        const { name, city, client, phone, budget, items } = req.body;

        const newPrestador = new Prestador({
            name,
            city,
            client,
            phone,
            budget,
            items,
        });

        await newPrestador.save();
        res.status(201).json({ message: 'Prestador cadastrado com sucesso!' });
    } catch (err) {
        next(err);
    }
});

// Rota para listar todas as cidades com prestadores cadastrados
app.get('/api/prestadores/cidades', async (req, res, next) => {
    try {
        const cidades = await Prestador.distinct('city');
        if (cidades.length === 0) {
            return res.status(404).json({ message: 'Nenhuma cidade cadastrada.' });
        }
        res.status(200).json(cidades);
    } catch (err) {
        next(err);
    }
});

// Rota para listar todos os prestadores cadastrados
app.get('/api/prestadores', async (req, res, next) => {
    try {
        const prestadores = await Prestador.find({});
        if (prestadores.length === 0) {
            return res.status(404).json({ message: 'Nenhum prestador cadastrado.' });
        }
        res.status(200).json(prestadores);
    } catch (err) {
        next(err);
    }
});

// Rota para deletar um prestador
app.delete('/api/prestadores/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const prestador = await Prestador.findByIdAndDelete(id);
        if (!prestador) {
            return res.status(404).json({ message: 'Prestador não encontrado.' });
        }
        res.status(200).json({ message: 'Prestador deletado com sucesso!' });
    } catch (err) {
        next(err);
    }
});

// Middleware para tratar erros de validação (celebrate)
app.use(errors());

// Middleware para tratar erros globais
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo deu errado!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});