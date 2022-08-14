const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { checkUser, insertUser } = require('../../model/user');
require('dotenv').config({ path: './.env' });

const userAPI = express.Router();
const saltRounds = 10;

userAPI.use(bodyParser.json());
userAPI.use(cookieParser());

//middleware
function ensureAuthenticated(req, res, next) {
  // 若使用者已通過驗證，則觸發 next()
  if (req.cookies.token) {
    return next();
  }
  // 若使用者尚未通過驗證，則將使用者導向登入頁面
  return res.status(403).json({
    error: true,
    message: '未登入會員，拒絕存取',
  });
}

userAPI.get('/user', ensureAuthenticated, async(req, res) => {
  let token = req.cookies.token;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    try {
      const checkedUser = await checkUser(decoded.payload.userEmail);
      if(checkedUser[0][0] === undefined) {
        return res.status(200).json({
          data: null,
        });
      } else {
        return res.status(200).json({
          data: {
            id: checkedUser[0][0].id,
            name: checkedUser[0][0].name,
            email: checkedUser[0][0].email,
            profile: checkedUser[0][0].profile,
          },
        });
      }
    }catch (error) {
    if(error) {
      return res.status(200).json({
        data: null,
      });
      }
    }
  } else {
    return res.status(200).json({
      data: null,
    });
  }
});

userAPI.patch('/user', async(req, res) => {
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).json({
      error: true,
      message: '請輸入電子信箱和密碼',
    });
  } else if (!req.body.email.match(/^([\w\.\-]){1,64}\@([\w\.\-]){1,64}$/)) {
    return res.status(400).json({
      error: true,
      message: '電子信箱格式須包含「@」',
    });
  } else if (!req.body.password.match(/^[0-9a-zA-Z_]+$/)) {
    return res.status(400).json({
      error: true,
      message: '請勿在密碼輸入特殊符號',
    });
  } else {
    try {
      const checkedUser = await checkUser(req.body.email);
      if(checkedUser[0][0] === undefined) {
        return res.status(200).json({
          error: true,
          message: '查無此會員帳號',
        });
      }else {
        bcrypt.compare(
          req.body.password,
          checkedUser[0][0].password,
          function (err, result) {
            if (result === true) {
              const payload = {
                userId: checkedUser[0][0].id,
                userName: checkedUser[0][0].name,
                userEmail: checkedUser[0][0].email,
                method: 'Local'
              };
              const token = jwt.sign(
                { payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
                process.env.JWT_SECRET_KEY
              );
              res.cookie('token', token, { maxAge: 900000, httpOnly: true });
              return res.status(200).json({
                ok: true,
              });
            } else {
              return res.status(400).json({
                error: true,
                message: '登入失敗，電子信箱或密碼輸入錯誤',
              });
            }
          }
        );
      }
    }catch (error) {
      if(error) {
        return res.status(500).json({
          error: true,
          message: '伺服器發生錯誤',
        });
      }
    }
  }
});

userAPI.post('/user', async(req, res) => {
  let userData = req.body;
  if (
    userData.name === '' ||
    userData.email === '' ||
    userData.password === ''
  ) {
    return res.status(400).json({
      error: true,
      message: '請輸入姓名、電子郵件和密碼',
    });
  } else if (!userData.email.match(/^([\w\.\-]){1,64}\@([\w\.\-]){1,64}$/)) {
    return res.status(400).json({
      error: true,
      message: '電子信箱格式須包含「@」',
    });
  } else if (!userData.password.match(/^[0-9a-zA-Z_]+$/)) {
    return res.status(400).json({
      error: true,
      message: '請勿在密碼輸入特殊符號',
    });
  } else {
    try {
      const checkedUser = checkUser(userData.email);
      if (checkedUser[0] !== undefined) {
        return res.status(400).json({
          error: true,
          message: '帳戶已被註冊',
        });
      }else {
          bcrypt.hash(userData.password, saltRounds, async (err, hash) => {
            if (err) {
              console.log(err);
              return res.status(400).json({
                error: true,
                message: '伺服器發生錯誤',
              });
            }
            let hashedPassword = hash;
            // Store hash in your password DB.
            let userPicture = null;
            try {
              const insertedUser = await insertUser(userData.name, userData.email, hashedPassword, userPicture);
              if(insertedUser) {
                return res.status(200).json({
                  ok: true,
                  message: '註冊成功',
                });
              }
            }catch (error) {
              if(error) {
                return res.status(500).json({
                  error: true,
                  message: '伺服器發生錯誤',
                });
              }
            }
          });
        }
    }catch (error) {
      if(error) {
        return res.status(500).json({
          error: true,
          message: '伺服器發生錯誤',
        });
      }
    }
  }
});

userAPI.delete('/user', (req, res) => {
  let token = req.cookies.token;
  if (token) {
    res.cookie('token', '', { maxAge: 0, httpOnly: true });
    res.cookie('require', '', { maxAge: 0, httpOnly: true });
    return res.status(200).json({
      ok: true,
    });
  } else {
    return res.status(200).json({
      ok: true,
    });
  }
});

module.exports = userAPI;
