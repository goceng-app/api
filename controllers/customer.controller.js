import CustomerModel from '../models/customer.model.js'; 

export default class CustomerController
{
  async getDetail(req, res) {
    try {
      const custModel = new CustomerModel;
      const customerDetail = await custModel.customerDetail(req.customer.id)
      if(!customerDetail) throw new Error("Not Found");
      return res.json(customerDetail);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  }
}
