const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("user");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport, messageTest) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            //   console.log("Message testing " + messageTest);
            //console.log("Found User by passport");
            // user will be set to req, it is accesable from other private route
            return done(null, user);
          } else {
            return done(null, false, { msg: "no user found" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
  );
};
