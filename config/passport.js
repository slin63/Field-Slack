const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport) {
    console.log(passport);
    let opts = { };
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    // For some reason jwt_payload isn't being called
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.getUserByID(jwt_payload.user._id, (err, user) => {
            if (err) { return done(err, false); }
            if (user) { return done(null, user); }
            else { return done(null, false); }
        });
    }));
}