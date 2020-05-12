const mongoose = require('mongoose');

//Order Schema
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //All ids for a order are same design
    idcard: { type: mongoose.Schema.Types.ObjectId, ref: 'Idcard', required: true },
    customerName: { type: String, required: true },
    count: { type: Number, required: true },
    status: { type: String, default: "PENDING" }
});

module.exports = mongoose.model('Order', orderSchema);