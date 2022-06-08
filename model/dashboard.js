const pool = require('./connection');
module.exports = {
  updateProfile: (userId, imageUrl, cb) => {
    pool.getConnection((error, connection) => {
      if (error) {
        return cb(error.message);
      }
      connection.query(
        'UPDATE `user` SET profile = ? WHERE `id` = ? ;',
        [imageUrl, Number(userId)],
        (error, result) => {
          if (error) {
            return cb(error);
          }
          console.log('Number of records inserted: ' + result.affectedRows);
          return cb(null, result);
        }
      );
      connection.release();
    });
  },
};
