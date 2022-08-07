const pool = require('./connection-promise');

module.exports = {
  async checkTown(regionA, regionB, regionC) {
    try {
      await connection.beginTransaction();
      const result = 
      await connection.query(
        'select * from `town` where `region`= ? or `region`= ? or `region`= ?',
        [regionA, regionB, regionC]);
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  },
  async searchHotel(townId) {
    try {
      await connection.beginTransaction();
      const result = 
      await connection.query(
        'select * from `hotel` where `zipcode`= ?',
        [townId]);
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  }
  // checkTown: (regionA, regionB, regionC, cb) => {
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
  //         'select * from `town` where `region`= ? or `region`= ? or `region`= ?',
  //         [regionA, regionB, regionC],
  //         (error, result) => {
  //           if (error) {
  //             connection.rollback()
  //             return cb(error);
  //           }
  //           return cb(null, result);
  //         }
  //       );
  //       connection.release();
  //     })
  //   });
  // },
  // searchHotel: (townId, cb) => {
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
  //         'select * from `hotel` where `zipcode`= ?',
  //         [townId],
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
