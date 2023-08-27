import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Container } from 'typedi';
import CustomerController from '../controllers/customer.controller.js';
import AuthController from '../controllers/auth.controller.js';
import authMiddleware from '../libraries/auth.middleware.js';
import pkg from 'express-group-routes';
import config from '../config.js';
import ProductController from '../controllers/product.controller.js';
import { createClient } from 'redis';

export default class Loaders {
  constructor(app) {
    this.app = app;
  }

  async setupMySQLPool() {
    const pool = mysql.createPool({
      host: config.mysql.host,
      user: config.mysql.user,
      database: config.mysql.database,
      password: config.mysql.password
    });
    const connection = pool.promise();
    Container.set('mysqlpool', connection);
  }

  async setupRedis(){
    const client = createClient({
      url: config.redis.url
    });
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    console.log("Redis client connected");
    Container.set('redis', client);
  }

  setupRoutes() {
    const customerCon = new CustomerController;
    const authCon = new AuthController;
    const productCon = new ProductController
    
    this.app.group('/auth', (route) => {
      route.post("/signup", authCon.signup);
      route.post("/login", authCon.login);
    });
    this.app.group('/', (route) => {
      route.use(authMiddleware);
      route.get("/", customerCon.getDetail);
      route.group('/customer', (route) => {
        route.get("/get", customerCon.getDetail);
      });
      route.group('/product', (route) => {
        route.get("/list", productCon.getProductList);
      });
    })
  }

  async load() {
    await this.setupMySQLPool();
    await this.setupRedis();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.setupRoutes();
    this.app.use(cors());
  }
}
