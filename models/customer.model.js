import Model from './model.js';

export default class CustomerModel extends Model{
  async customerDetail(id) {
    try {
      const connection = await this.pool.getConnection();
      const [[row]] = await connection.query('select id, name, phone, lastLogin from customers where id = ?', [id]);
      connection.release();
      return row;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

