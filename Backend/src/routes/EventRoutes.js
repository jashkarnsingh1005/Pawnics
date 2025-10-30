import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createEvent, getAllEvents, getMyEvents, updateEvent, deleteEvent } from '../controllers/EventController.js';

const router = express.Router();

router.post('/', verifyToken, createEvent);
router.get('/', getAllEvents);
router.get('/my', verifyToken, getMyEvents);
router.put('/:id', verifyToken, updateEvent);
router.delete('/:id', verifyToken, deleteEvent);

export default router;


