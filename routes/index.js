const mongoose = require('mongoose')
const passport = require('passport')
const jwt = require('jwt-simple')
const router = require('express').Router()

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
          const token = jwt.encode(user, config.secret)
          res.json({success: true, token: token})
        } else {
          res.send({success: false, msg: '验证失败, 用户密码错误!'})
        }
      })
    }
  })
})
router.get('/login', passport.authenticate('jwt', {session: false}), function (req, res) {
  const token = req.headers.authorization
  console.log(req.headers)
  if (token) {
    let decoded = jwt.decode(token, config.secret)
    User.findOne({username: decoded.username}, function (err, user) {
      if (err) {
        console.log(err)
      }
      if (!user) {
        return res.send({success: false, msg: '用户未找到!'})
      } else {
        return res.josn({success: true, msg: `欢迎光临! ${user.username}.`})
      }
    })
  } else {
    res.send({success: false, msg: '用户未注册!'})
  }
})

// function getToken (headers) {
//   if (headers && headers.authorization) {
//     let parted = headers.authorization.split(' ')
//     if (parted.lenght === 2) {
//       return parted[1]
//     } else {
//       return null
//     }
//   } else {
//     return null
//   }
// }

module.exports = router
