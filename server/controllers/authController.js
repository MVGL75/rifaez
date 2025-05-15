import {User} from '../models/Users.js'
import Raffle from '../models/Raffle.js';
import { registerSchema, saveSchema } from '../validators/registerSchema.js';
import sanitizeUser from '../utils/sanitize.js';
import passport from 'passport';
export const register = async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.json({ message: error.details[0].message, status: 400 });
    }
    const { email, name, password } = value;
    const user = new User({ username: email, name });
    await User.register(user, password);
    req.login(user, async () => {
      const popUser = await user.populate()
      const safeUser = sanitizeUser(popUser)
      res.json({ user: safeUser, message: 'Creacion de usuario fue exitosa.', status: 201 });
    });
}
export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.json({ message: 'Email or password is incorrect', status: 400 });
      }
      req.logIn(user, async (err) => {
        if (err) return next(err);
        const popUser = await user.populate('raffles')
        const safeUser = sanitizeUser(popUser)
        return res.json({ message: 'Login successful!', user: safeUser, status: 200 });
      });
    })(req, res, next);
  }
export const logout = (req, res, next) => {
    req.logout(function (err) {
      if (err) { 
        return next(err); 
      }
      res.json({ message: 'Logged out successfully' }); // ✅ Only ONE response
    });
}
export const save = async(req, res)=> {
      const { error, value } = saveSchema.validate(req.body);
      if (error) {
        return res.json({ message: error.details[0].message, status: 400 });
      }
      const userData = value
      const user = await User.findByIdAndUpdate(req.user._id, {...userData});
      if(user){
        res.json({message: "Se guardo exitosamente", status: 200})
      } else {
        res.json({message: "Usuario no se encontro", status: 400})
      }
  }