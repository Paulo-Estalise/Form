const mongoose = require('mongoose');

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

module.exports = mongoose.model('Prestador', prestadorSchema);