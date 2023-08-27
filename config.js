// config.js
import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWTSECRET,
    jwtExpiration: process.env.JWTEXP || '1d',
    digiflazz:{
      username : process.env.DIGIFLAZZ_USERNAME,
      key : process.env.DIGIFLAZZ_KEY
    },
    mysql : {
      host: process.env.DBHOST,
      user: process.env.DBUSER,
      database: process.env.DBNAME,
      password: process.env.DBPASS
    },
    margin: process.env.MARGIN || 500,
    redis: {
      url : process.env.REDISURL,
    }
};
  