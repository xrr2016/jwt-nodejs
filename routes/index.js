const mongoose = require('mongoose')
const router = require('express').Router()
const jwt = require('jwt-simple')

const User = require('../models/user')
const config = require('../config/config')

mongoose.Promise = global.Promise
mongoose.connect(config.db)

router.get('/', (req, res, next) => {
  res.send('Here is api route')
})

router.post('/signup', function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: '用户名和密码为必填项.'})
  } else {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    newUser.save(function (err) {
      if (err) {
        return res.json({success: false, msg: '用户名已存在!'})
      } else {
        res.json({success: true, msg: '注册成功!'})
      }
    })
  }
})

router.post('/auth', function (req, res) {
  User.findOne({username: req.body.username}, function (err, user) {
    if (err) throw err
    if (!user) {
      res.send({success: false, msg: '未找到用户!'})
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // 生成token
          var token = jwt.encode(user, config.secret)
          res.json({success: true, token: 'JWT ' + token})
        } else {
          res.send({success: false, msg: '验证失败, 用户密码错误!'})
        }
      })
    }
  })
      // .then(function (user) {
      //   if (!user) {
      //     return res.status(403).snd({success: false, msg: '未找到用户.'})
      //   } else {
      //     user.comparePassword(req.body.password, function (err, isMatch) {
      //       if (isMatch && !err) {
      //         let token = jwt.encode(user, config.secret)
      //         res.json({successs: true, token: `JWT${token}`})
      //       } else {
      //         return res.status(403).snd({success: false, msg: '验证失败!'})
      //       }
      //     })
      //   }
      // })
      // .catch(function (err) {
      //   throw err
      // })
})

module.exports = router
