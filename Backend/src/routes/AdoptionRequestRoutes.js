import express from 'express';
import { createAdoptionRequest, getReceivedRequests, getSentRequests, updateRequestStatus, getRequestsByPet, deleteRequest } from '../controllers/AdoptionRequestController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create a new adoption request (requires authentication)
router.post('/', verifyToken, createAdoptionRequest);

// Get received adoption requests (requires authentication)
router.get('/received', verifyToken, getReceivedRequests);

// Get sent adoption requests (requires authentication)
router.get('/sent', verifyToken, getSentRequests);

// Update adoption request status (requires authentication)
router.put('/:id', verifyToken, updateRequestStatus);

// Get all adoption requests for a specific pet (requires authentication)
router.get('/pet/:petId', verifyToken, getRequestsByPet);

// Delete an adoption request (requires authentication, owner only)
router.delete('/:id', verifyToken, deleteRequest);

export default router;