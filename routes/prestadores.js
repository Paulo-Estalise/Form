const express = require('express');
const { celebrate, Joi } = require('celebrate');
const Prestador = require('../models/Prestador');

const router = express.Router();

// Cadastrar prestador
router.post('/', celebrate({
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

// Listar cidades
router.get('/cidades', async (req, res, next) => {
    try {
        const cidades = await Prestador.distinct('city');
        res.status(200).json(cidades.length ? cidades : { message: 'Nenhuma cidade cadastrada.' });
    } catch (err) {
        next(err);
    }
});

// Listar todos os prestadores
router.get('/', async (req, res, next) => {
    try {
        const prestadores = await Prestador.find({});
        res.status(200).json(prestadores.length ? prestadores : { message: 'Nenhum prestador cadastrado.' });
    } catch (err) {
        next(err);
    }
});

// Deletar prestador
router.delete('/:id', async (req, res, next) => {
    try {
        const prestador = await Prestador.findByIdAndDelete(req.params.id);
        res.status(200).json(prestador ? { message: 'Prestador deletado com sucesso!' } : { message: 'Prestador não encontrado.' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;