const mongoose = require('mongoose');

// Define o schema para o modelo "Prestador"
const prestadorSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nome do prestador (obrigatório)
    city: { type: String, required: true }, // Cidade do prestador (obrigatório)
    client: { type: String, required: true }, // Nome do cliente (obrigatório)
    phone: { type: String, required: true }, // Telefone do prestador (obrigatório)
    budget: { type: Number, required: true }, // Orçamento total (obrigatório)
    items: [{
        item: { type: String, required: true }, // Nome do item (obrigatório)
        area: { type: Number, required: true }, // Área do item (obrigatório)
        price: { type: Number, required: true }, // Preço do item (obrigatório)
    }],
});

// Exporta o modelo "Prestador" para ser usado em outras partes da aplicação
module.exports = mongoose.model('Prestador', prestadorSchema);