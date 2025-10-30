import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './LostFoundChat.module.css';
import { FaPaperPlane, FaArrowLeft, FaUser } from 'react-icons/fa';

const LostFoundChat = ({ conversationId, petInfo, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Get current user
    fetchCurrentUser();

    // Join conversation room
    newSocket.emit('join_conversation', conversationId);

    // Listen for new messages
    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for typing indicators
    newSocket.on('user_typing', () => {
      setIsTyping(true);
    });

    newSocket.on('user_stop_typing', () => {
      setIsTyping(false);
    });

    // Fetch existing messages
    fetchMessages();

    return () => {
      newSocket.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCurrentUser = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get('http://localhost:3001/api/auth/getUserDetails', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchMessages = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`http://localhost:3001/api/lost-found-messages/conversation/${conversationId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setLoading(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const accessToken = localStorage.getItem('accessToken');
    const messageData = {
      petId: petInfo._id,
      receiverId: petInfo.userId._id,
      message: newMessage,
      messageType: 'general'
    };

    try {
      const response = await axios.post('http://localhost:3001/api/lost-found-messages', messageData, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      // Emit message via socket
      socket.emit('send_message', {
        ...response.data,
        conversationId
      });

      // Add to local messages
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { conversationId });
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { conversationId });
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          <FaArrowLeft />
        </button>
        <div className={styles.petInfo}>
          <img src={`http://localhost:3001/${petInfo.photo}`} alt={petInfo.petName} />
          <div>
            <h3>{petInfo.petName}</h3>
            <p>{petInfo.type === 'lost' ? 'Lost Pet' : 'Found Pet'}</p>
          </div>
        </div>
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
            transition={{ duration: 0.3 }}
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
              <FaUser />
              <span>{message.senderId.name}</span>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <div className={styles.typingIndicator}>
            <div className={styles.typingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Someone is typing...</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.messageForm} onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type your message..."
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendBtn} disabled={!newMessage.trim()}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default LostFoundChat;
