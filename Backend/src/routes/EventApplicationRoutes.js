import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { applyToEvent, getMyEventApplications, getMySubmittedEventApplications, updateEventApplicationStatus, deleteEventApplication } from '../controllers/EventApplicationController.js';

const router = express.Router();

router.post('/', verifyToken, applyToEvent);
router.get('/received', verifyToken, getMyEventApplications);
router.get('/sent', verifyToken, getMySubmittedEventApplications);
router.put('/:id', verifyToken, updateEventApplicationStatus);
router.delete('/:id', verifyToken, deleteEventApplication);

export default router;


