const UserModel = require('../models/Users')
const bcryptjs = require('bcryptjs')

module.exports = {
  read: async function (req, res) {
    const results = await UserModel.getAllUsers()
    results.forEach(function (o, i) {
      results[i].picture = process.env.APP_USER_PICTURE_URI.concat(results[i].picture)
    })
    const data = {
      success: true,
      data: results
    }
    res.send(data)
  },
  create: async function (req, res) {
    const picture = (req.file && req.file.filename) || null
    const { username, password } = req.body
    const encryptedPassword = bcryptjs.hashSync(password)
    const results = await UserModel.createUser(picture, username, encryptedPassword)

    delete req.body.password
    const data = {
      success: true,
      msg: `User ${username} has been created`,
      data: { id: results, ...req.body }
    }
    res.send(data)
  },
  update: async function (req, res) {
    const picture = (req.file && req.file.filename) || null
    const { id } = req.params
    const { username, password } = req.body
    const encryptedPassword = bcryptjs.hashSync(password)
    const results = await UserModel.updateUser(id, picture, username, encryptedPassword)
    delete req.body.password
    if (results) {
      const data = {
        success: true,
        msg: `User with id ${id} has been updated!`,
        data: { id, ...req.body }
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'There is no data can be updated'
      }
      res.send(data)
    }
  },
  delete: async function (req, res) {
    const { id } = req.params
    const results = await UserModel.deleteUser(id)
    if (results) {
      const data = {
        success: true,
        msg: `Users with id ${id} has been deleted!`
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'There is no data can be deleted'
      }
      res.send(data)
    }
  }
}
