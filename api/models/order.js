const mongoose = require('mongoose');

//ID schema
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    orderItem: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idcard', required: true }],
    organizationName: { type: String, default: 'NA' }
});

module.exports = mongoose.model('Order', orderSchema);