const pool = require('./connection');

module.exports = {
  checkTown: (regionA, regionB, regionC, cb) => {
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
          'select * from `town` where `region`= ? or `region`= ? or `region`= ?',
          [regionA, regionB, regionC],
          (error, result) => {
            if (error) {
              connection.rollback()
              return cb(error);
            }
            return cb(null, result);
          }
        );
        connection.release();
      })
    });
  },
  searchHotel: (townId, cb) => {
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
          'select * from `hotel` where `zipcode`= ?',
          [townId],
          (error, result) => {
            if (error) {
              return cb(error);
            }
            return cb(null, result);
          }
        );
        connection.release();
      })
    });
  },
};
