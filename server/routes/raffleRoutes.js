import express from 'express';
import { createRaffle, viewUpdateRaffle, addNote, findRaffle, deleteRaffle, editFindRaffle, editRaffle, contactRaffle, paymentRaffle, markPaid, verifyRaffle } from '../controllers/raffleController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/upload.js';
import hasPermission from '../middleware/hasPermission.js';
import checkPlan from '../middleware/checkPlan.js';
// import customDomain from '../middleware/customDomain.js';
import catchAsync from '../utils/catchAsync.js';
import rafflePlan from '../middleware/rafflePlan.js';

const router = express.Router();




// POST /api/raffle
router.post('/create', isAuthenticated, catchAsync(checkPlan), upload.array('images', 10), catchAsync(rafflePlan), catchAsync(createRaffle));
router.post('/delete/:id', isAuthenticated, hasPermission, catchAsync(deleteRaffle));
router.post('/edit/:id', isAuthenticated, hasPermission, upload.array('images', 10), catchAsync(rafflePlan), catchAsync(editRaffle));
router.post('/:id/:ticketID/mark_paid', isAuthenticated, hasPermission, catchAsync(markPaid));
router.post('/:id/:ticketID/add_note', isAuthenticated, hasPermission, catchAsync(addNote));
router.post('/:id/contact', catchAsync(contactRaffle));
router.post('/:id/payment', catchAsync(paymentRaffle));
router.post('/:id/view', catchAsync(viewUpdateRaffle));
router.post('/:id/verify', catchAsync(verifyRaffle));
// GET /api/raffle/:id
router.get('/:id', catchAsync(findRaffle));
router.get('/edit/:id', isAuthenticated, hasPermission, catchAsync(editFindRaffle));

export default router;
