const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    setMC: { type: Number, required: true },
    setFJ: { type: Number, required: true }
});


module.exports = mongoose.model('Entry', EntrySchema)
