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
}

