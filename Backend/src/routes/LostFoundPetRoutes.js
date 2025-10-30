import express from 'express';
import { 
  createLostFoundPet, 
  getLostFoundPets, 
  getUserLostFoundPets,
  getLostFoundPetById,
  updateLostFoundPet,
  deleteLostFoundPet,
  markPetResolved,
  upload
} from '../controllers/LostFoundPetController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getLostFoundPets);
router.get('/pet/:id', getLostFoundPetById);

// Protected routes
router.use(authenticateToken);

// Create new lost/found pet report (with file upload)
router.post('/', upload.single('photo'), createLostFoundPet);

// Get user's own reports
router.get('/my-reports', getUserLostFoundPets);

// Update pet report (with optional file upload)
router.put('/:id', upload.single('photo'), updateLostFoundPet);

// Delete pet report
router.delete('/:id', deleteLostFoundPet);

// Mark pet as resolved
router.patch('/:id/resolve', markPetResolved);

export default router;
