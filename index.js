const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  const data = {
    success: true,
    msg: 'Hello from Backend!'
  }
  res.send(data)
})

app.get('/migrate', function (req, res) {
  require('./src/migrations/Users')
  const data = {
    success: true,
    msg: 'Data has been migrated'
  }
  res.send(data)
})

// Import Router
const UserRoutes = require('./src/routes/Users')
const AuthRoutes = require('./src/routes/Auth')

app.use('/users', UserRoutes)
app.use('/auth', AuthRoutes)

app.listen(process.env.APP_PORT, function () {
  console.log(`App listen on Port ${process.env.APP_PORT}`)
})
