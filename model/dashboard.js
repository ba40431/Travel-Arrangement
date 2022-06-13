const pool = require('./connection');
module.exports = {
  updateProfile: (userId, imageUrl, cb) => {
    pool.getConnection((error, connection) => {
      if (error) {
        return cb(error.message);
      }
      connection.beginTransaction((error) => {
        if (error) {
          connection.rollback()
          return cb(error.message);
        }
        connection.query(
          'UPDATE `user` SET profile = ? WHERE `id` = ? ;',
          [imageUrl, Number(userId)],
          (error, result) => {
            if (error) {
              connection.rollback()
              return cb(error);
            }
            connection.commit((error) => {
              if (error) {
                connection.rollback()
                return cb(error);
              }
              return cb(null, result);
            })
          }
        );
        connection.release();
      })
    });
  },
};
