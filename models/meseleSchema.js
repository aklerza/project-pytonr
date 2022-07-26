const mongoose = require('mongoose')
const Schema = mongoose.Schema

const meseleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  solve: {
    type: String,
    required: true
  }
}, {timestamps: true})

const Mesele = mongoose.model('Mesele', meseleSchema)
module.exports = Mesele