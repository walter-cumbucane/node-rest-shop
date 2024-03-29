const mongoose = require('mongoose');

//Define the schema for orders
const orderSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required: true},
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);