import Model from './model.js';

export default class AuthModel extends Model{
  async customerDetail(phone) {
    try {
      const connection = await this.pool.getConnection();
      const [[rows]] = await connection.query(`
        SELECT c.id, c.name, c.phone, ca.password, ca.isBlocked, ca.isVerified
        FROM customers c, customerAuth ca 
        WHERE c.id = ca.customerId and phone = ?
      `, [phone]);
      connection.release();
      return rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async signup(userData) {
    const connection = await this.pool.getConnection();
    try {
      const {
        name, phone, password
      } = userData;
      await connection.beginTransaction();
      const [rows] = await connection.query(`insert into customers (name, phone) values (?, ?)`, [name, phone]);
      await connection.query(`insert into customerAuth (customerId, password) values (?, ?)`, [rows.insertId, password]);
      await connection.commit();
      connection.release();
      return rows;
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.log(error);
      throw error;
    }
  }
}
