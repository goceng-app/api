import axios from "axios";
import config from "../config.js";
import RedisLib from "./redis.lib.js";

export default class DigiLib {
  constructor() {
    this.username = config.digiflazz.username;
    this.key = config.digiflazz.key;
    this.url = 'https://api.digiflazz.com/v1/price-list';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }

  async getProduct() {
    try {
      const redisLib = new RedisLib;
      const redisKey = "getProduct";
      const cacheExist = await redisLib.get(redisKey);
      if(cacheExist){
        return {
          data : cacheExist,
          cached : true
        }
      };
      // if not exist
      const requestData = {
        cmd: 'prepaid',
        username: this.username,
        sign: this.key
      };
      let { data } = await axios.post(this.url, requestData);
      data = data.data;
      data = data.map( i => {
        return {
          product_name: i.product_name,
          category: i.category,
          brand: i.brand,
          type: i.type,
          desc: i.desc,
          price : Number(i.price) + Number(config.margin),
          // priceOld : Number(i.price),
        }
      });
      redisLib.set(redisKey, data, 60); // 24 hours
      return {
        data,
        cached : false
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}