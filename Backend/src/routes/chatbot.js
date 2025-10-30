import express from 'express';
import { sendMessage } from '../controllers/ChatbotController.js';

const router = express.Router();

// POST /api/chatbot/message - Send message to chatbot
router.post('/message', sendMessage);

export default router;
