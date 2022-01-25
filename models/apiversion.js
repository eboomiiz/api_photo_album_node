const mongoose = require('mongoose')

  const schema = new mongoose.Schema({
    version: { type: String, required: true, trim: true }
  },{collection: 'apiversions'});

  const apiversion = mongoose.model('Apiversion', schema)

  module.exports = apiversion

