const mongoose = require('mongoose')

  const schema = new mongoose.Schema({
    photo: { type: String, default: 'nopic.png' },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true }
  },{collection: 'introductions'});

  const introduction = mongoose.model('Introduction', schema)

  module.exports = introduction

