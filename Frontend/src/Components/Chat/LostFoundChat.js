import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaArrowLeft, FaTimes } from 'react-icons/fa';
import styles from './LostFoundChat.module.css';

const LostFoundChat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [conversationInfo, setConversationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchCurrentUser();
    fetchMessages();
  }, [conversationId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-scroll when new message is added
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const fetchCurrentUser = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get('http://localhost:3001/api/auth/getUserDetails', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/login');
    }
  };

  const fetchMessages = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`http://localhost:3001/api/lost-found-messages/conversation/${conversationId}/messages`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (response.data.success) {
        setMessages(response.data.data);
        
        // Get conversation info from first message
        if (response.data.data.length > 0) {
          const firstMessage = response.data.data[0];
          setConversationInfo({
            pet: firstMessage.petId,
            otherUser: firstMessage.senderId._id === currentUser?._id ? firstMessage.receiverId : firstMessage.senderId
          });
        }
        
        // Mark conversation as read
        await axios.patch(`http://localhost:3001/api/lost-found-messages/conversation/${conversationId}/read`, {}, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const accessToken = localStorage.getItem('accessToken');
    
    // Get receiver ID from existing messages
    const receiverId = messages.length > 0 
      ? (messages[0].senderId._id === currentUser._id ? messages[0].receiverId._id : messages[0].senderId._id)
      : null;
    
    if (!receiverId) {
      alert('Cannot send message. Please try again.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/lost-found-messages', {
        petId: conversationInfo?.pet?._id,
        receiverId: receiverId,
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.data.success) {
        // Add new message to local state
        setMessages(prev => [...prev, response.data.data]);
        setNewMessage('');
        // Immediately scroll to new message
        setTimeout(() => scrollToBottomInstant(), 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enhanced auto-scroll for new messages
  const scrollToBottomInstant = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  const closeModal = () => {
    navigate('/inbox');
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className={styles.chatPage} onClick={handleBackgroundClick}>
        <div className={styles.chatContainer}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatPage} onClick={handleBackgroundClick}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <button className={styles.backButton} onClick={closeModal}>
            <FaArrowLeft />
          </button>
          <div className={styles.chatInfo}>
            {conversationInfo?.pet && (
              <img 
                src={`http://localhost:3001/${conversationInfo.pet.photo}`} 
                alt={conversationInfo.pet.petName}
                className={styles.petPhoto}
              />
            )}
            <div>
              <h3>Chat about: {conversationInfo?.pet?.petName || 'Pet'}</h3>
              <p>With: {conversationInfo?.otherUser?.name || 'Pet Owner'}</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={closeModal}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <motion.div
              key={message._id}
              className={`${styles.message} ${
                message.senderId._id === currentUser?._id ? styles.sent : styles.received
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className={styles.messageContent}>
                <p>{message.message}</p>
                <span className={styles.messageTime}>
                  {new Date(message.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div className={styles.messageSender}>
                <span>{message.senderId.name}</span>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles.messageForm} onSubmit={sendMessage}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className={styles.messageInput}
            />
            <button type="submit" className={styles.sendButton} disabled={!newMessage.trim()}>
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LostFoundChat;
