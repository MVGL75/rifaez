import express from 'express';
import { createRaffle, viewUpdateRaffle, addNote, findRaffle, deleteRaffle, editFindRaffle, editRaffle, contactRaffle, paymentRaffle, markPaid } from '../controllers/raffleController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/upload.js';
// import customDomain from '../middleware/customDomain.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();


// POST /api/raffle
router.post('/create', isAuthenticated, upload.array('images', 10), catchAsync(createRaffle));
router.post('/delete/:id', isAuthenticated, catchAsync(deleteRaffle));
router.post('/edit/:id', isAuthenticated, upload.array('images', 10), catchAsync(editRaffle));
router.post('/:raffleID/:id/mark_paid', isAuthenticated, catchAsync(markPaid));
router.post('/:raffleID/:id/add_note', isAuthenticated, catchAsync(addNote));
router.post('/:id/contact', catchAsync(contactRaffle));
router.post('/:id/payment', catchAsync(paymentRaffle));
router.post('/:id/view', catchAsync(viewUpdateRaffle));
// GET /api/raffle/:id
router.get('/:id', catchAsync(findRaffle));
router.get('/edit/:id', isAuthenticated, catchAsync(editFindRaffle));

export default router;
