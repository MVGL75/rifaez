import {User} from '../models/Users.js'
import Raffle from '../models/Raffle.js';
import { registerSchema, saveSchema, workerSchema } from '../validators/registerSchema.js';
import sanitizeUser from '../utils/sanitize.js';
import { v2 as cloudinary } from 'cloudinary';
import plans from '../seed/plans.js';
import passport from 'passport';
import AppError from '../utils/AppError.js';
export const register = async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.json({ message: error.details[0].message, status: 400 });
    }
    const { email, name, password } = value;
    const user = new User({ username: email, name });
    await User.register(user, password);
    req.login(user, async () => {
      const clientUser = await setUserForClient(req, user)
      res.json({ user: clientUser, message: 'Creacion de usuario fue exitosa.', status: 201 });
    });
}
export const login = (req, res, next) => {
    passport.authenticate('worker-aware', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.json({ message: 'Email or password is incorrect', status: 400 });
      }
      req.logIn(user, async (err) => {
        if (err) return next(err);
        const clientUser = await setUserForClient(req, user)
        return res.json({ message: 'Login successful!', user: clientUser , status: 200 });
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
      const parsedBody = {
        ...req.body,
      }
      const { error, value } = saveSchema.validate(parsedBody);
      if (error) {
        return res.json({ message: error.details[0].message, status: 400 });
      }
      const tempUser = await User.findById(req.user._id)
      if(req.file){
        if(tempUser.logo){
          await cloudinary.uploader.destroy(tempUser.logo.public_id);
        }
        value.logo = {url: req.file.path, public_id: req.file.filename}
      }
      const userData = value
      const user = await User.findByIdAndUpdate(req.user._id, {...userData});
      if(user){
        res.json({message: "Se guardo exitosamente", status: 200})
      } else {
        res.json({message: "Usuario no se encontro", status: 400})
      }
  }

  export const checkPass = async (req, res) => {
    let password = req.body.password; 
    if(!password) password = '';
    const user = await User.findByUsername(req.user.username);
    if (!user) {
      return res.json({ error: 'User not found', status: 400 });
    }
    const isValid = await new Promise((resolve) => {
      user.authenticate(password, (err, thisUser, passwordErr) => {
        if (err || passwordErr) return resolve(false);
        return resolve(true);
      });
    });
    if (isValid) {
      res.json({ message: "Password is correct", status: 200 });
    } else {
      res.json({ message: "Password is incorrect", status: 400 });
    }
  };

  export const changePass = async (req, res) => {
    let { password, password_new } = req.body; 
    if(!password) password = '';
    if(!password_new) password_new = '';
    const user = await User.findByUsername(req.user.username)
    if (!user) {
      return res.json({ error: 'User not found', status: 400 });
    }
    user.changePassword(password, password_new, function(err) {
      if (err) {
        return res.json({ error: err, status: 400 });
      } else {
        return res.json({ error: 'password changed', status: 200 });
      }
    });
  };
  
  export const findUser = async (req, res) => {
      const user = await User.findById(req.user._id)
      if(!user) return res.json({ message: 'User not found', status: 401 });
      const clientUser = await setUserForClient(req, user)
      return res.json(clientUser);
 
  }


  async function setUserForClient(req, user){
    const popUser = await user.populate('raffles')
    const safeUser = sanitizeUser(popUser)
    return {...safeUser, currentPlan: plans[user.planId]?.name, planStatus: user.subscriptionStatus,  asWorker: req.user.asWorker,}
  }

  export const addWorker = async (req, res) => {
    const {email, password} = req.body
    const {error, value} = workerSchema.validate({email})
    if(error){
      throw new AppError(error);
    }
    if(!password) password = '';
    const user = await User.findByUsername(req.user.username);
    if (!user) {
      return res.json({ error: 'User not found', status: 400 });
    }
    const isValid = await new Promise((resolve) => {
      user.authenticate(password, (err, thisUser, passwordErr) => {
        if (err || passwordErr) return resolve(false);
        return resolve(true);
      });
    });
    if(isValid){
      const allowedWorkers = plans[req.user?.planId]?.workers;
      if(req.user?.workers?.length >= allowedWorkers){
        return res.json({message: `Tu plan actual no te deja hacer mas de (${allowedWorkers}) trabajadores. Actualiza tu plan para poder hacer mas trabajadores.`, status: 808})
      }
      await User.updateOne(
        { _id: req.user._id },
        { $push: { workers: value } }
      );

      res.json({message: "worker added", status: 200})
    } else {
      res.json({message: "password incorrect", status: 400})
    }
  }
  export const removeWorker = async (req, res) => {
    const {error, value} = workerSchema.validate(req.body)
    if(error){
      throw new AppError(error);
    }
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { workers: value } }
    );
    

    res.json({message: "worker removed", status: 200})
  }