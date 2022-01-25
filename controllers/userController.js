const User = require('../models/uesr')

//validation
const { validationResult } = require('express-validator')

//jwt
const jwt = require('jsonwebtoken')

const config = require('../config/index')

exports.index = async (req, res, next) => {
  try {
    const users = await User.find().sort({ _id: -1 });

    res.status(200).json({
      data: users
    });

  } catch (error) {
    res.status(400).json({
        error: {
            message: 'There was an error from the server, please try again.'
        }
      });
  }
  }


  exports.register = async (req, res, next) => {

    try {
      const { name, email, password } = req.body

    //validation
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
      const error = new Error('Incorrect information.')
      error.statusCode = 422
      error.validation = errors.array()
      throw error
      }

    //check email ซ้ำ
    const existEmail = await User.findOne({email: email})
    if (existEmail) {
      const error = new Error('This email has already been used.')
      error.statusCode = 400
      throw error
    }

    let user = new User();
    user.name = name
    user.email = email
    user.password = await user.encryptPassword(password)//เข้ารหัส password

    await user.save()

    res.status(201).json({
      message: 'Completed registration.'
    })
    } catch (error) {
      next(error)
    }
  }


  exports.login = async (req, res, next) => {

    try {
      const { email, password } = req.body
    //validation
      // const errors = validationResult(req)
      // if (!errors.isEmpty()) {
      // const error = new Error('ข้อมูลไม่ถูกต้อง')
      // error.statusCode = 422
      // error.validation = errors.array()
      // throw error
      // }

    //check มีอีเมล์ในระบบหรือไม่
    const user = await User.findOne({email: email})
    if (!user) {
      const error = new Error('The user was not found on the system.')
      error.statusCode = 404
      throw error
    }

    //check รหัสผ่านตรงกันหรือไม่ หากไม่ตรง (false) ให้โยน error ออกไป
    const isValid = await user.checkPassword(password)
    if (!isValid) {
      const error = new Error('Password is incorrect.')
      error.statusCode = 401
      throw error
    }

    //create token
    const token = await jwt.sign({
      id: user._id,
      role: user.role
    }, config.JWT_SECRET, { expiresIn: '1 days' })

    //decode วันหมดอายุ
    const expires_in = jwt.decode(token)

    res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: 'Bearer'
    })
    } catch (error) {
      next(error)
    }

  }

  //get profile
  exports.me = async (req, res, next) => {
    try {
      const { _id, name, email, role } = req.user
      res.status(200).json({
        user: {
          id: _id,
          name: name,
          email: email,
          role: role
        }
      })
  
    } catch (error) {
      res.status(400).json({
          error: {
              message: 'There was an error from the server, please try again.'
          }
        });
    }
    }