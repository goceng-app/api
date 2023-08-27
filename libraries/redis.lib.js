import { Container } from 'typedi';

export default class RedisLib {
  constructor() {
    this.client = Container.get('redis');
  }
  async get(key) {
    const value = await this.client.get(key);
    return JSON.parse(value);
  }
  set(key, value, ttlInSeconds = 3600) {
    this.client.multi()
      .set(key, JSON.stringify(value))
      .expire(key, ttlInSeconds)
      .exec((err, result) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log('Key set with TTL:', result);
        }
        // Quit the Redis client
        this.client.quit();
      });
  }
}