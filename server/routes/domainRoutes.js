import isAuthenticated from '../middleware/isAuthenticated.js';
import express from 'express';
import { createDomain, verifyCname, verifyDomain } from '../controllers/domainController.js';
import catchAsync from '../utils/catchAsync.js';
const router = express.Router();

router.use(isAuthenticated)

router.post('/', catchAsync(createDomain));

router.post('/verify', catchAsync(verifyDomain));

router.post('/verify/cname', catchAsync(verifyCname));
  

  export default router