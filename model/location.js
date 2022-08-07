const pool = require('./connection-promise');

module.exports = {
  async attractionDetail(attractionId) {
    try {
      await connection.beginTransaction();
      const result = 
      await connection.query(
        'select * from attraction JOIN `arrangement`\
            ON  `attraction`.`id` = `arrangement`.`attraction_id`  \
            where `attraction`.`id`= ? ',
        [attractionId]);
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  },
  async hotelDetail(hotelId) {
    try {
      await connection.beginTransaction();
      const result = 
      await connection.query(
        'select * from hotel where `id`= ? ',
        [hotelId]);
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  }
  // attractionDetail: (attractionId, cb) => {
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
  //         'select * from attraction JOIN `arrangement`\
  //                      ON  `attraction`.`id` = `arrangement`.`attraction_id`  \
  //                      where `attraction`.`id`= ? ',
  //         [attractionId],
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
  // hotelDetail: (hotelId, cb) => {
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
  //         'select * from hotel where `id`= ? ',
  //         [hotelId],
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
};
