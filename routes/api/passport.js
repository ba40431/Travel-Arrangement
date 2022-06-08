const express = require('express');
const passport = require('../../model/passport');
const cookieParser = require('cookie-parser');

const { checkUser, insertUser } = require('../../model/user');
require('dotenv').config({ path: './.env' });

const passportAPI = express.Router();

passportAPI.use(cookieParser());

passportAPI.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

passportAPI.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failMessage: 'Cannot login to Google, please try again later!',
    failureRedirect: '/sign-in',
    // successRedirect: '/',
    // session: false
  }),
  async (req, res) => {
    const fullName = req.user.displayName;
    const email = req.user.emails[0].value;
    const picture = req.user.photos[0].value;
    const googleId = req.user.id;

    checkUser(email, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: '伺服器發生錯誤',
        });
      } else if (result[0] === undefined) {
        insertUser(fullName, email, googleId, picture, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: true,
              message: '伺服器發生錯誤',
            });
          }
        });
      }
    });
    res.redirect('/');
  }
);

module.exports = passportAPI;
