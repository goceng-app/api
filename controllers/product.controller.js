import DigiLib from "../libraries/digiflazz.lib.js";

export default class ProductController
{
  async getProductList(req, res) {
    try {
      const digiLib = new DigiLib;
      return res.json(await digiLib.getProduct());
    } catch (error) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  }
}
