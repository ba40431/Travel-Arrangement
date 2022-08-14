const pool = require('./connection-promise');

module.exports = {
  async updateProfile(userId, imageUrl) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = 
      await connection.query('UPDATE `user` SET profile = ? WHERE `id` = ? ;', [imageUrl, Number(userId)]);
      await connection.commit();
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  }
};
