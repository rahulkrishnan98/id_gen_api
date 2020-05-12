const mongoose = require('mongoose');

//ID schema
const idcardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    designFile: { type: String, required: true },
    fieldName: { type: [String], required: true }
});

module.exports = mongoose.model('Idcard', idcardSchema);