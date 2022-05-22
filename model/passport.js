const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config({path:'./.env'});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET_KEY,
    callbackURL: '/api/auth/google/callback',
    // callbackURL: 'https://www.travel-arrangement.website/api/auth/google/callback',
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, cb) => {
    if (profile) {
        return cb(null, profile);
    }
    else {
        return cb(null, false);
    }
}))

passport.serializeUser((user,  cb) => {
    // console.log('serializeUser:', user.id);
    cb(null, user);
})

passport.deserializeUser((userData, cb) => {
    // console.log(userData)
    cb(null, userData);
})

module.exports =  passport;