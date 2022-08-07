const pool = require('./connection-promise');

module.exports = {
  async updateProfile(userId, imageUrl) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await connection.query('UPDATE `user` SET profile = ? WHERE `id` = ? ;', [imageUrl, Number(userId)]);
      await connection.commit();
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  }

  
  // updateProfile: (userId, imageUrl, cb) => {
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
  //         'UPDATE `user` SET profile = ? WHERE `id` = ? ;',
  //         [imageUrl, Number(userId)],
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
};
