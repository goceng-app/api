import AuthModel from '../models/auth.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';

export default class AuthController  {
  async login(req, res){
    const { phone, password } = req.body;
    try {
      // check credentials
      const authModel = new AuthModel;
      const user = await authModel.customerDetail(phone);
      if(!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) throw new Error("Invalid credentials");

      const payload = { id: user.id };

      jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration }, (error, token) => {
        if (error) throw error;
        return res.json({ token });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error.message);
    }
  }
  async signup(req, res){
    const {
      name, phone, password, passwordConfirm
    } = req.body
    try {
      if(password !== passwordConfirm) throw new Error('pass should be same');
      if(!name || !phone || !password) throw new Error('item required');

    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
}
