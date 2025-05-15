import { register, login, logout, save} from '../controllers/authController.js'
import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import catchAsync from '../utils/catchAsync.js';
const router = express.Router();

router.post('/register', catchAsync(register));
router.post('/save_settings', isAuthenticated, catchAsync(save))
router.post('/login', login);
router.post('/logout', logout);

export default router
