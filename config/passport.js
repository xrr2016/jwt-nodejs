const JwtStrategy = require('passport-jwt').Strategy
const User = require('../src/models/user')
const config = require('../config/database')

module.exports = (passport) => {
  let options = {}
  options.secretOrKey = config.secret
  passport.use(new JwtStrategy(options, function (jwtPayload, done) {
    User.findOne({id: jwtPayload.id}, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))
}
