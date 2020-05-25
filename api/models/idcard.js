const mongoose = require('mongoose');

//ID schema
const idcardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    data: { type: [String], required: true },
    status: { type: String, default: "incomplete" }
});

module.exports = mongoose.model('Idcard', idcardSchema);