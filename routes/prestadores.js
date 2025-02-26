const express = require('express');
const { celebrate, Joi } = require('celebrate');
const Prestador = require('../models/Prestador'); // Importa o modelo Prestador

const router = express.Router();

// Rota para cadastrar um novo prestador
router.post('/', celebrate({
    body: Joi.object({
        name: Joi.string().required(), // Nome do prestador (obrigatório)
        city: Joi.string().required(), // Cidade do prestador (obrigatório)
        client: Joi.string().required(), // Nome do cliente (obrigatório)
        phone: Joi.string().required(), // Telefone do prestador (obrigatório)
        budget: Joi.number().required(), // Orçamento total (obrigatório)
        items: Joi.array().items(Joi.object({
            item: Joi.string().required(), // Nome do item (obrigatório)
            area: Joi.number().required(), // Área do item (obrigatório)
            price: Joi.number().required(), // Preço do item (obrigatório)
        })).required(), // Array de itens (obrigatório)
    }),
}), async (req, res, next) => {
    try {
        const newPrestador = new Prestador(req.body); // Cria um novo prestador
        await newPrestador.save(); // Salva no banco de dados
        res.status(201).json({ message: 'Prestador cadastrado com sucesso!' });
    } catch (err) {
        next(err); // Passa o erro para o middleware de tratamento de erros
    }
});

// Rota para listar todas as cidades dos prestadores
router.get('/cidades', async (req, res, next) => {
    try {
        const cidades = await Prestador.distinct('city'); // Busca cidades distintas
        res.status(200).json(cidades.length ? cidades : { message: 'Nenhuma cidade cadastrada.' });
    } catch (err) {
        next(err); // Passa o erro para o middleware de tratamento de erros
    }
});

// Rota para listar todos os prestadores
router.get('/', async (req, res, next) => {
    try {
        const prestadores = await Prestador.find({}); // Busca todos os prestadores
        res.status(200).json(prestadores.length ? prestadores : { message: 'Nenhum prestador cadastrado.' });
    } catch (err) {
        next(err); // Passa o erro para o middleware de tratamento de erros
    }
});

// Rota para deletar um prestador pelo ID
router.delete('/:id', async (req, res, next) => {
    try {
        const prestador = await Prestador.findByIdAndDelete(req.params.id); // Deleta o prestador pelo ID
        res.status(200).json(prestador ? { message: 'Prestador deletado com sucesso!' } : { message: 'Prestador não encontrado.' });
    } catch (err) {
        next(err); // Passa o erro para o middleware de tratamento de erros
    }
});

module.exports = router; // Exporta o router para ser usado em outras partes da aplicação