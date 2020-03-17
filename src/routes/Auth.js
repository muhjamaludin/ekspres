const Auth = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AuthModel = require('../models/Auth')
// const AuthController = require('../controllers/Auth')
const UserModel = require('../models/Users')

Auth.post('/login', async function (req, res) {
  const { username, password } = req.body
  const checkUser = await AuthModel.checkUsername(username)
  if (!checkUser) {
    const data = {
      success: false,
      msg: 'Wrong Username'
    }
    res.send(data)
  } else {
    const info = await AuthModel.checkUsername(username)
    const checkPassword = bcrypt.compareSync(password, info.password)
    if (checkPassword) {
      if (await AuthModel.checkVerifiedUser(info.id)) {
        if (await AuthModel.checkActivatedUser(info.id)) {
          const payload = { username, roleId: info.role_id }
          const key = process.env.APP_KEY
          const options = { expiresIn: '15m' }
          const token = jwt.sign(payload, key, options)
          const data = {
            success: true,
            token
          }
          res.send(data)
        } else {
          const data = {
            success: false,
            msg: 'User is not verified!'
          }
          res.send(data)
        }
      }
  } else {
    const data = {
      success: false,
      msg: 'Wrong Username or Password'
    }
    res.send(data)
  }
}

Auth.post('/register', async function (req, res) {
  const { username, password } = req.body
  const checkUser = await AuthModel.checkUsername(username)
  if (!checkUser) {
    const data = {
      success: false,
      msg: 'Username already use'
    }
    res.send(data)
  } else {
    const encryptedPassword = bcrypt.hashSync(password)
    const result = UserModel.createUser(null, username, encryptedPassword)
    if (result) {
      const data = {
        success: true,
        msg: 'Register Successfully'
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'Register Failed'
      }
      res.send(data)
    }
  }
}

module.exports = Auth
