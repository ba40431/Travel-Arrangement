const pool = require('./connection-promise');

module.exports = {
  async insertUser(userName, userEmail, userPassword, userPicture) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await connection.query('INSERT INTO `user` (name, email, password, profile) VALUES (?, ?, ?, ?);',
      [userName, userEmail, userPassword, userPicture]);
      await connection.commit();
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  },
  async checkUser(userEmail) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await connection.query('SELECT * FROM `user` WHERE email = ?;',[userEmail]);
      return result
    }catch (error) {
      console.log(error)
      connection.rollback();
    } finally {
      connection.release();
    }
  }
};
