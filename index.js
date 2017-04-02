const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')
const jwt = require('jwt-simple')
const database = require('./config/database')
const User = require('./src/models/user')
const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use(morgan('dev'))

app.use(passport.initialize())

app.get('/', (req, res) => {
  res.send(`Hello! 这里是localhost:${port}/api`)
})

app.listen(port, () => {
  console.log(`app listening on ${port}`)
})



