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

// Outras rotas (listar, deletar, etc.)...

module.exports = router; // Exporta o router para ser usado em outras partes da aplicação