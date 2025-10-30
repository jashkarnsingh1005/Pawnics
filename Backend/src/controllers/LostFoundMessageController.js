import mongoose from 'mongoose';
import LostFoundMessage from '../models/LostFoundMessage.js';
import LostFoundPet from '../models/LostFoundPet.js';

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    console.log('Received message request:', req.body);
    console.log('User ID from token:', req.user.id);

    const { petId, receiverId, message } = req.body;
    const senderId = req.user.id;

    // Validate required fields
    if (!petId || !receiverId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: petId, receiverId, message' 
      });
    }

    // Generate conversation ID: petId_smallerUserId_largerUserId
    const userIds = [senderId, receiverId].sort();
    const conversationId = `${petId}_${userIds[0]}_${userIds[1]}`;

    console.log('Creating message with conversationId:', conversationId);

    const newMessage = new LostFoundMessage({
      conversationId,
      petId,
      senderId,
      receiverId,
      message,
      isRead: false
    });

    await newMessage.save();
    console.log('Message saved successfully');

    // Populate the saved message
    await newMessage.populate([
      { path: 'senderId', select: 'name email' },
      { path: 'receiverId', select: 'name email' },
      { path: 'petId', select: 'petName photo type breed' }
    ]);

    console.log('Message populated successfully');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message,
      details: error.stack 
    });
  }
};

// Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all messages where user is sender or receiver
    const messages = await LostFoundMessage.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    })
    .populate('senderId', 'name email')
    .populate('receiverId', 'name email')
    .populate('petId', 'petName photo type breed')
    .sort({ createdAt: -1 });

    // Group by conversation ID and get latest message for each
    const conversationMap = new Map();
    
    messages.forEach(message => {
      const convId = message.conversationId;
      if (!conversationMap.has(convId)) {
        conversationMap.set(convId, {
          conversationId: convId,
          petId: message.petId,
          senderId: message.senderId,
          receiverId: message.receiverId,
          lastMessage: message.message,
          lastMessageTime: message.createdAt,
          unreadCount: 0
        });
      }
      
      // Count unread messages for this user
      if (message.receiverId._id.toString() === userId && !message.isRead) {
        conversationMap.get(convId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationMap.values());
    
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get messages for a specific conversation
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const messages = await LostFoundMessage.find({ conversationId })
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .populate('petId', 'petName photo type breed')
      .sort({ createdAt: 1 });

    // Verify user has access to this conversation
    if (messages.length > 0) {
      const hasAccess = messages.some(msg => 
        msg.senderId._id.toString() === userId || msg.receiverId._id.toString() === userId
      );
      
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Mark conversation as read
export const markConversationRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await LostFoundMessage.updateMany(
      { conversationId, receiverId: userId, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: 'Conversation marked as read' });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
