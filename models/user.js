const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  ad: {
    type: String,
    required: true,
    unique: true
  },
  sifre: {
    type: String,
    required: true,
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User