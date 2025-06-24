import isAuthenticated from '../middleware/isAuthenticated.js';
import express from 'express';
import { createDomain, verifyCname, pollHostnameStatus } from '../controllers/domainController.js';
import catchAsync from '../utils/catchAsync.js';
import customDomain from '../middleware/customDomain.js';
const router = express.Router();

router.use(isAuthenticated)

router.use(customDomain)

router.post('/', catchAsync(createDomain));

router.post('/verify/cname', catchAsync(verifyCname));

router.post('/poll_hostname_status', catchAsync(pollHostnameStatus))
  

  export default router