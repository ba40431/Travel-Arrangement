const pool = require('./connection-promise');

module.exports = {
  async checkTown(regionA, regionB, regionC) {
    const connection = await pool.getConnection();
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
    const connection = await pool.getConnection();
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
};
