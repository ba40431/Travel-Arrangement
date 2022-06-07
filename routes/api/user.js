const express = require('express');
// const session = require('cookie-session');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { checkUser, insertUser } = require('../../model/user');
require('dotenv').config({path:'./.env'})

const userAPI = express.Router();
const saltRounds = 10;

userAPI.use(bodyParser.json())
userAPI.use(cookieParser())


//middleware
function ensureAuthenticated(req, res, next) {
  // console.log(req.session.passport.user)
  // 若使用者已通過驗證，則觸發 next()
  if (req.session.passport || req.cookies.token) { return next() }
  // 若使用者尚未通過驗證，則將使用者導向登入頁面
  return res.status(403).json({
    'error': true,
    'message': '未登入會員，拒絕存取'
  })
}

userAPI.get('/user', ensureAuthenticated, (req, res) => {
  let token = req.cookies.token
  if(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    try{
      checkUser(decoded.payload.userEmail, (err, result) => {
        if(err) {
          console.log(err)
          return res.status(500).json({
            'error': true,
            'message': '伺服器發生錯誤'
          })
        }else if(result[0] === undefined) {
          return res.status(200).json({
            'data': null
          })
        }else {
          return res.status(200).json({
            'data': {
              'id': result[0].id,
              'name': result[0].name,
              'email': result[0].email,
              'profile': result[0].profile
            }
          })
        }
      })
    }catch {
      return res.status(500).json({
        'error': true,
        'message': '伺服器發生錯誤'
      })
    }

  }
  else if(req.session.passport.user !== null) {
    try {
      checkUser(req.session.passport.user.emails[0].value, (err, result) => {
        if(err) {
          console.log(err)
          return res.status(500).json({
            'error': true,
            'message': '伺服器發生錯誤'
          })
        }else if(result[0] === undefined) {
          return res.status(200).json({
            'data': null
          })
        }else {
          return res.status(200).json({
            'data': {
              'id': result[0].id,
              'name': result[0].name,
              'email': result[0].email,
              'profile': result[0].profile,
            }
          })
        }
      })
    }catch {
      return res.status(500).json({
        'error': true,
        'message': '伺服器發生錯誤'
      })
    }
    // return res.status(200).json({
    //   'data': {
    //     'name': req.session.passport.user.displayName,
    //     'email': req.session.passport.user.emails[0].value
    //   }
    // })
  }else {
    return res.status(200).json({
      'data': null
    })
  }
});

userAPI.patch('/user', (req, res) => {
  if(req.body.email === '' || req.body.password === '') {
    return res.status(400).json({
      'error': true,
      'message': '請輸入電子信箱和密碼'
    })
  }else if(!req.body.email.match(/^([\w\.\-]){1,64}\@([\w\.\-]){1,64}$/)) {
    return res.status(400).json({
      'error': true,
      'message': '電子信箱格式須包含「@」'
    })
  }else if(!req.body.password.match(/^[0-9a-zA-Z_]+$/)) {
    return res.status(400).json({
      'error': true,
      'message': '請勿在密碼輸入特殊符號'
    })
  }else {
    checkUser(req.body.email, (err, result) => {
      let userData = result
      if(err) {
        console.log(err)
        return res.status(500).json({
          'error': true,
          'message': '伺服器發生錯誤'
        })
      }else if(userData[0] === undefined) {
        return res.status(200).json({
          'error': true,
          'message': '查無此會員帳號'
        })
      }else {
        bcrypt.compare(req.body.password, userData[0].password, function(err, result) {
          if(result === true) {
            const payload = {
              userId: userData[0].id,
              userName: userData[0].name,
              userEmail: userData[0].email
            };
            const token = jwt.sign({ payload, exp: Math.floor(Date.now() / 1000) + (60 * 15) }, process.env.JWT_SECRET_KEY); //exp 15分鐘
            res.cookie('token', token, { maxAge: 900000, httpOnly: true })
            return res.status(200).json({
              'ok': true,
            })
          }else {
            return res.status(400).json({
              'error': true,
              'message': '登入失敗，電子信箱或密碼輸入錯誤'
            })  
          }
        });

      }
    })
  }
})

userAPI.post('/user', (req, res) => {
  let userData = req.body;
  if(userData.name === '' || userData.email === '' || userData.password === '') {
    return res.status(400).json({
      'error': true,
      'message': '請輸入姓名、電子郵件和密碼'
    })
  }else if(!userData.email.match(/^([\w\.\-]){1,64}\@([\w\.\-]){1,64}$/)) {
    return res.status(400).json({
      'error': true,
      'message': '電子信箱格式須包含「@」'
    })
  }else if(!userData.password.match(/^[0-9a-zA-Z_]+$/)) {
    return res.status(400).json({
      'error': true,
      'message': '請勿在密碼輸入特殊符號'
    })
  }else {
    checkUser(userData.email, (err, result) => {
      if(err) {
        console.log(err)
        return res.status(500).json({
          'error': true,
          'message': '伺服器發生錯誤'
        })
      }else if(result[0] !== undefined) {
        return res.status(400).json({
          'error': true,
          'message': '帳戶已被註冊'
        })
      }else {
        bcrypt.hash(userData.password, saltRounds, async(err, hash) => {
            if(err) {
              console.log(err)
              return res.status(400).json({
                'error': true,
                'message': '伺服器發生錯誤'
              })
            }
            let hashedPassword = hash
            // Store hash in your password DB.
            let userPicture = null
            insertUser(userData.name, userData.email, hashedPassword, userPicture, (err, result) => {
              if(err) {
                console.log(err)
                return res.status(500).json({
                  'error': true,
                  'message': '伺服器發生錯誤'
                })
              }
              return res.status(200).json({
                'ok': true,
                'message': '註冊成功'
              })
            });
          });
      }
    });
  }
})

userAPI.delete('/user', (req, res) => {
  let token = req.cookies.token
  if(token) {
    res.cookie('token', '', { maxAge: 0, httpOnly: true })
    res.cookie('require', '', { maxAge: 0, httpOnly: true })
    return res.status(200).json({
      'ok': true
    })
  }else if(req.session.passport) {
    req.session.passport.user = null;
    res.cookie('require', '', { maxAge: 0, httpOnly: true })
    return res.status(200).json({
      'ok': true
    })
  }else {
    return res.status(200).json({
      'ok': true
    })
  }
});

module.exports = userAPI;
