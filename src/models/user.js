const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: { type: String, uniuqe: true, required: true },
  password: { type: String, required: true }
})

userSchema.pre('save', (next) => {
  const user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

userSchema.methods.comparePassword = (password, cb) => {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', userSchema)
