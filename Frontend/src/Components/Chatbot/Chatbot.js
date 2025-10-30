import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './Chatbot.module.css';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Pawnics assistant. I can help you with information about pet adoption, lost & found pets, volunteer events, and general questions. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message to backend:', inputMessage);
      const response = await axios.post('http://localhost:3001/api/chatbot/message', {
        message: inputMessage
      });

      console.log('Backend response:', response.data);

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Provide local fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        text: `Hello! I'm your Pawnics assistant. I can help you with:

🐾 **Pet Adoption** - Browse available pets and learn about the adoption process
🔍 **Lost & Found** - Report missing pets or help reunite found pets with owners  
🤝 **Volunteer Events** - Join community activities and help local pets
💬 **General Pet Care** - Get advice on pet health, training, and care

What would you like to know about?`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className={styles.floatingButton}
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <FaRobot />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className={styles.chatModal}>
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <FaRobot className={styles.botIcon} />
              <div>
                <h3>Pawnics Assistant</h3>
                <span>Online</span>
              </div>
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`${styles.message} ${message.isBot ? styles.botMessage : styles.userMessage}`}
              >
                <div className={styles.messageContent}>
                  {message.text}
                </div>
                <div className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputContainer}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className={styles.messageInput}
              rows={1}
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage}
              className={styles.sendButton}
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
