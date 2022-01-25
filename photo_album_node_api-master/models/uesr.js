const mongoose = require('mongoose')

//เข้ารหัส password
const bcrypt = require('bcryptjs')

const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, index: true },
    password: { type: String, required: true, trim: true, minlength: 8 },
    role: { type: String, default: 'member' }
},{collection: 'users'}
)


//เข้ารหัส password
schema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
}

//เปรียบเทียบรหัสผ่านว่าตรงกันหรือไม่
schema.methods.checkPassword = async function(password) {
    const isValid = await bcrypt.compare(password, this.password)
    return isValid
}

const user = mongoose.model('User', schema)

module.exports = user
