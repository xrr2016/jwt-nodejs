const mongoose = require('mongoose')
const router = require('express').Router()
const User = require('../models/user')
const database = require('../../config/database')

mongoose.Promise = global.Promise
mongoose.connect(database.db)

router.get('/', (req, res, next) => {
  res.send('Here is api route')
})

router.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: '用户名和密码为必填项.'})
  } else {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    newUser.save(err => {
      if (err) {
        res.json({success: false, msg: '注册失败!'})
      } else {
        res.json({success: true, msg: '注册成功!'})
      }
    })
  }
})

module.exports = router
