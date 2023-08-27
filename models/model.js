import { Container } from 'typedi';

export default class Model
{
    constructor() {
      this.pool = Container.get('mysqlpool');
    }
}