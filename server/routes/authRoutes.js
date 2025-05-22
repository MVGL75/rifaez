import { register, login, logout, save, checkPass, changePass, findUser, addWorker, removeWorker, addPaymentMethod, removePaymentMethod} from '../controllers/authController.js'
import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import passport from 'passport';
import upload from '../middleware/upload.js';
import isWorker from '../middleware/isWorker.js';
import catchAsync from '../utils/catchAsync.js';
const router = express.Router();

router.post('/register', catchAsync(register));
router.post('/save_settings', isAuthenticated, isWorker, upload.single("logo"), catchAsync(save))
router.post('/check_password', isAuthenticated, isWorker, catchAsync(checkPass))
router.post('/save_settings/add_worker', isAuthenticated, isWorker, catchAsync(addWorker))
router.post('/save_settings/remove_worker', isAuthenticated, isWorker, catchAsync(removeWorker))
router.post('/save_settings/add_method', isAuthenticated, isWorker, catchAsync(addPaymentMethod))
router.post('/save_settings/remove_method', isAuthenticated, isWorker, catchAsync(removePaymentMethod))
router.post('/change_password', isAuthenticated, isWorker, catchAsync(changePass))
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', passport.authenticate('google', { 
  failureRedirect: '/login' 
}), (req, res) => {
  res.redirect('/dashboard');
});

// Facebook
app.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/facebook/callback', passport.authenticate('facebook', { 
  failureRedirect: '/login' 
}), (req, res) => {
  res.redirect('/dashboard');
});
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', isAuthenticated, catchAsync(findUser));

export default router
