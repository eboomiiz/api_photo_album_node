const mongoose = require('mongoose')
const Schema = mongoose.Schema

  const schema = Schema({
    photo: { type: String, default: 'nopic.png' },
    albumphoto: { type: Schema.Types.ObjectId, ref: 'Albumphoto' }

  },{collection: 'photos'});

  const photo = mongoose.model('Photo', schema)

  module.exports = photo
