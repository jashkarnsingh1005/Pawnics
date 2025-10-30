import express from 'express';
import { 
  sendMessage,
  getConversationMessages,
  getUserConversations,
  markConversationRead
} from '../controllers/LostFoundMessageController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Send a message
router.post('/', sendMessage);

// Get all conversations for user
router.get('/conversations', getUserConversations);

// Get messages for a specific conversation
router.get('/conversation/:conversationId/messages', getConversationMessages);

// Mark conversation as read
router.patch('/conversation/:conversationId/read', markConversationRead);

export default router;
