const pool = require('./connection-promise');

module.exports = {
  async attractionDetail(attractionId) {
    const connection = await pool.getConnection();
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
    const connection = await pool.getConnection();
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
};
