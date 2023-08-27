import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Container } from 'typedi';
import CustomerController from '../controllers/customer.controller.js';
import AuthController from '../controllers/auth.controller.js';
import authMiddleware from '../libraries/auth.middleware.js';
import pkg from 'express-group-routes';

export default class Loaders {
  constructor(app) {
    this.app = app;
  }

  async setupMySQLPool() {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'gocengapp',
      password: 'zainulkarim'
    });
    const connection = pool.promise();
    Container.set('mysqlpool', connection);
  }

  setupRoutes() {
    const customerCon = new CustomerController;
    const authCon = new AuthController;
    
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
    })
  }

  async load() {
    await this.setupMySQLPool();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.setupRoutes();
    this.app.use(cors());
  }
}
