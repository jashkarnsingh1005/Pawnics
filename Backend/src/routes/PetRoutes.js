import express from 'express';
import { createPet, getAllPets, getPetsByOwner, getPetById, updatePet, deletePet } from '../controllers/PetController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create a new pet (requires authentication)
router.post('/', verifyToken, createPet);

// Get all pets (public route)
router.get('/', getAllPets);

// Get pets by owner (requires authentication)
router.get('/my-pets', verifyToken, getPetsByOwner);

// Get pet by ID (public route)
router.get('/:id', getPetById);

// Update pet (requires authentication)
router.put('/:id', verifyToken, updatePet);

// Delete pet (requires authentication)
router.delete('/:id', verifyToken, deletePet);

export default router;