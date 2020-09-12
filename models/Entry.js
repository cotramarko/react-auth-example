const mongoose = require('mongoose')

const EntrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  sets: [
    {
      setNumber: { type: Number, min: 1, required: true },
      pointsMC: { type: Number, min: 0, max: 30, required: true },
      pointsFJ: { type: Number, min: 0, max: 30, required: true }
    }
  ],
  locked: { type: Boolean, default: false, required: true },
  setMC: { type: Number },
  setFJ: { type: Number }
})

module.exports = mongoose.model('Entry', EntrySchema)
