const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const passport = require('passport')
// const jwt = require('jwt-simple')
// const User = require('./src/models/user')
const router = require('./src/routes/index')
const port = process.env.PORT || 3000

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(morgan('dev'))

app.use(passport.initialize())

app.get('/', (req, res) => {
  res.send(`Hello! 这里是localhost:${port}/api`)
})
require('./config/passport')(passport)
app.use('/api', router)

app.listen(port, () => {
  console.log(`app listening on ${port}`)
})

