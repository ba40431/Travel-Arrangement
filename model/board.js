const pool = require('./connection-promise');
//如果要使用board頁面，改connection database: process.env.RDS_BOARD_DATABASE
module.exports = {
  async insertMessage(title, imageUrl) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await connection.query(
        'INSERT INTO `message` (title, image_url) VALUES (?, ?);',[title, imageUrl]);
      await connection.commit();
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  },
  async checkMessage() {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await connection.query('SELECT * FROM `message`;');
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  }
};
