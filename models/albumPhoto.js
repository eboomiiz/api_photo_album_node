const mongoose = require('mongoose')

  const schema = new mongoose.Schema({
    photo: { type: String, default: 'nopic.png' },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true }
  },{toJSON: {virtuals: true}, collection: 'albumphotos'});

  //create virtual ฟิลด์
  schema.virtual('photos', {
    ref: 'Photo', //ลิงก์ไปที่โมเดล Photo
    localField: '_id', //_id ฟิลด์ของโมเดล Albumphoto (ไฟล์นี้)
    foreignField: 'albumphoto' //albumphoto ฟิลด์ของโมเดล Photo (fk)
  })

  const albumphoto = mongoose.model('Albumphoto', schema)

  module.exports = albumphoto

