const express = require('express');
const querystring = require('query-string');
const bodyParser = require('body-parser')
const axios = require('axios')
const jwt = require('jsonwebtoken');
const { checkUser, insertUser } = require('../../model/user');
require('dotenv').config({ path: './.env' });

const authAPI = express.Router();

authAPI.use(bodyParser.json())
authAPI.use(bodyParser.urlencoded({ extended: true }))

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET_KEY;
// const root = 'http://localhost:3000';
const root = 'https://travel-arrangement.website/';
const redirectUrl = `${root}/api/auth/google/callback`

authAPI.get('/auth/google', (req, res) => {
    const query = {
    redirect_uri: redirectUrl,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ')
  }
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  res.redirect(`${authUrl}?${querystring.stringify(query)}`)
})

authAPI.get('/auth/google/callback', async(req, res) => {
  const code = req.query.code
  const options = {
    code,
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUrl,
    grant_type: 'authorization_code'
  }
  const url = 'https://oauth2.googleapis.com/token'
  const response = await axios.post(url, querystring.stringify(options))
  const { id_token, access_token } = response.data
  const authData = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    {
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    }
  )
  const fullName = authData.data.name;
  const email = authData.data.email;
  const picture = authData.data.picture;
  const googleId = authData.data.id;
  checkUser(email, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: true,
        message: '伺服器發生錯誤',
      });
    }
    if (result[0] === undefined) {
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
    const payload = {
      userName: fullName,
      userEmail: email,
      method: 'Google',
    };
    const token = jwt.sign(
      { payload, exp: Math.floor(Date.now() / 1000) + 60 * 15 },
      process.env.JWT_SECRET_KEY
    ); //exp 15分鐘
    res.cookie('token', token, { maxAge: 900000, httpOnly: true });
    res.redirect('/')
  });
})

module.exports = authAPI;
