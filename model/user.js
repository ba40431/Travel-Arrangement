const pool = require('./connection-promise');

module.exports = {
  async insertUser(userName, userEmail, userPassword, userPicture) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await connection.query('INSERT INTO `user` (name, email, password, profile) VALUES (?, ?, ?, ?);',
      [userName, userEmail, userPassword, userPicture]);
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  },
  async checkUser(userEmail) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await connection.query('SELECT * FROM `user` WHERE email = ?;',[userEmail]);
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  }
  // insertUser: (userName, userEmail, userPassword, userPicture, cb) => {
  //   pool.getConnection((error, connection) => {
  //     if (error) {
  //       return cb(error.message);
  //     }
  //     connection.beginTransaction((error) => {
  //       if (error) {
  //         connection.rollback()
  //         return cb(error.message);
  //       }
  //       connection.query(
  //         'INSERT INTO `user` (name, email, password, profile) VALUES (?, ?, ?, ?);',
  //         [userName, userEmail, userPassword, userPicture],
  //         (error, result) => {
  //           if (error) {
  //             connection.rollback()
  //             return cb(error);
  //           }
  //           connection.commit((error) => {
  //             if (error) {
  //               connection.rollback()
  //               return cb(error);
  //             }
  //             return cb(null, result);
  //           })
  //         }
  //       );
  //       connection.release();

  //     })
  //   });
  // },
  // checkUser: (userEmail, cb) => {
  //   pool.getConnection((error, connection) => {
  //     if (error) {
  //       return cb(error.message);
  //     }
  //     connection.beginTransaction((error) => {
  //       if (error) {
  //         return cb(error.message);
  //       }
  //       connection.query(
  //         'SELECT * FROM `user` WHERE email = ?;',
  //         [userEmail],
  //         (error, result) => {
  //           if (error) {
  //             return cb(error);
  //           }
  //           return cb(null, result);
  //         }
  //       );
  //       connection.release();
  //     })
  //   });
  // },
};
