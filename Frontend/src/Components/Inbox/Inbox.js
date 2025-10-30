import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './Inbox.module.css';
import { FaEnvelope, FaPaperPlane, FaSpinner } from 'react-icons/fa';

const Inbox = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState({
    received: [],
    sent: [],
    eventReceived: [],
    eventSent: [],
    lostFoundMessages: []
  });

  // Fallback sample data in case API fails
  const sampleRequests = {
    received: [
      {
        _id: '1',
        petId: {
          _id: '1',
          name: 'Max',
          photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d'
        },
        userId: '789',
        userName: 'Michael Johnson',
        message: 'I would love to adopt Max! I have a large yard and plenty of time for walks and play.',
        reason: 'I grew up with Golden Retrievers and have been looking to adopt one for months.',
        contactInfo: 'michael@example.com, 555-123-4567',
        status: 'pending',
        createdAt: '2023-08-15'
      }
    ],
    sent: [
      {
        _id: '3',
        petId: {
          _id: '2',
          name: 'Whiskers',
          photo: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131'
        },
        ownerId: 'admin',
        message: 'I would take great care of Whiskers! I have a quiet apartment perfect for a cat.',
        reason: 'I have always had cats and recently lost my elderly cat. I am ready to welcome a new companion.',
        contactInfo: 'myemail@example.com, 555-555-5555',
        status: 'pending',
        createdAt: '2023-08-12'
      }
    ],
    eventReceived: [],
    eventSent: [],
    lostFoundMessages: []
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/api/auth/getUserDetails', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      setLoading(false);
      return null;
    }
  };

  // Fetch adoption requests from API
  const fetchRequests = async (currentUser) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || !currentUser) {
      setLoading(false);
      return;
    }

    try {
      // Fetch received requests (where the user is the pet owner)
      const receivedResponse = await axios.get('http://localhost:3001/api/adoption-requests/received', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Fetch sent requests (where the user is the applicant)
      const sentResponse = await axios.get('http://localhost:3001/api/adoption-requests/sent', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Fetch event applications
      const eventReceivedRes = await axios.get('http://localhost:3001/api/event-applications/received', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const eventSentRes = await axios.get('http://localhost:3001/api/event-applications/sent', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Fetch lost & found conversations
      let lostFoundMessages = [];
      try {
        const lostFoundConversationsRes = await axios.get('http://localhost:3001/api/lost-found-messages/conversations', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (lostFoundConversationsRes.data.success) {
          // Process conversations from new API structure
          lostFoundMessages = lostFoundConversationsRes.data.data.map(conversation => {
            const isUserSender = conversation.senderId._id === currentUser._id;
            const isUserReceiver = conversation.receiverId._id === currentUser._id;
            
            return {
              _id: conversation.conversationId,
              conversationId: conversation.conversationId,
              petId: conversation.petId,
              senderId: conversation.senderId,
              receiverId: conversation.receiverId,
              message: conversation.lastMessage,
              createdAt: conversation.lastMessageTime,
              unreadCount: conversation.unreadCount,
              isSent: isUserSender && !isUserReceiver, // Only sent if user is sender but not receiver
              isReceived: isUserReceiver && !isUserSender // Only received if user is receiver but not sender
            };
          });
        }
      } catch (error) {
        console.error('Error fetching Lost & Found conversations:', error);
        lostFoundMessages = [];
      }

      
      setRequests({
        received: receivedResponse.data,
        sent: sentResponse.data,
        eventReceived: eventReceivedRes.data,
        eventSent: eventSentRes.data,
        lostFoundMessages: lostFoundMessages
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching adoption requests:', error);
      // Fallback to sample data if API fails
      setRequests(sampleRequests);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const userData = await fetchUserDetails();
      if (userData) {
        await fetchRequests(userData);
      }
    };

    initializeData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusUpdate = async (requestId, newStatus) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('You must be logged in to update request status');
      return;
    }
    
    try {
      // Send status update to API
      await axios.put(`http://localhost:3001/api/adoption-requests/${requestId}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      
      // Update local state after successful API call
      setRequests(prevRequests => ({
        ...prevRequests,
        received: prevRequests.received.map(request => 
          request._id === requestId ? { ...request, status: newStatus } : request
        )
      }));
      
      // Show success message
      alert(`Request ${newStatus === 'accepted' ? 'accepted' : 'declined'} successfully`);
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return styles.pendingBadge;
      case 'accepted':
        return styles.acceptedBadge;
      case 'not_accepted':
        return styles.notAcceptedBadge;
      default:
        return styles.pendingBadge;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'not_accepted':
        return 'Not Accepted';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading inbox...</p>
      </div>
    );
  }

  return (
    <div className={styles.inboxPage}>
      <Navbar />
      
      <div className={styles.container}>
        <motion.div 
          className={styles.inboxHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Your Inbox</h1>
          <p>Manage your adoption requests, event applications, and Lost & Found messages</p>
        </motion.div>
        
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'received' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('received')}
            >
              <FaEnvelope /> Received Requests
              {requests.received?.length > 0 && (
                <span className={styles.tabBadge}>{requests.received.length}</span>
              )}
            </button>
            
            <button 
              className={`${styles.tab} ${activeTab === 'sent' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              <FaPaperPlane /> Sent Requests
              {requests.sent?.length > 0 && (
                <span className={styles.tabBadge}>{requests.sent.length}</span>
              )}
            </button>

            <button 
              className={`${styles.tab} ${activeTab === 'eventSent' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('eventSent')}
            >
              <FaPaperPlane /> Event Applications
              {requests.eventSent?.length > 0 && (
                <span className={styles.tabBadge}>{requests.eventSent.length}</span>
              )}
            </button>

            <button 
              className={`${styles.tab} ${activeTab === 'lostFoundReceived' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('lostFoundReceived')}
            >
              <FaEnvelope /> L&F Received
              {requests.lostFoundMessages?.filter(msg => msg.isReceived).length > 0 && (
                <span className={styles.tabBadge}>{requests.lostFoundMessages.filter(msg => msg.isReceived).length}</span>
              )}
            </button>
            
            <button 
              className={`${styles.tab} ${activeTab === 'lostFoundSent' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('lostFoundSent')}
            >
              <FaPaperPlane /> L&F Sent
              {requests.lostFoundMessages?.filter(msg => msg.isSent).length > 0 && (
                <span className={styles.tabBadge}>{requests.lostFoundMessages.filter(msg => msg.isSent).length}</span>
              )}
            </button>
          </div>
        </div>
        
        <div className={styles.requestsContainer}>
          {activeTab === 'received' && (
            <>
              {requests.received?.length > 0 ? (
                <div className={styles.requestsList}>
                  {(requests.received || []).map((request, index) => (
                    <motion.div 
                      key={request._id} 
                      className={styles.requestCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={styles.requestHeader}>
                        <div className={styles.petInfo}>
                          <img 
                            src={request.petId?.photo || 'https://via.placeholder.com/150'} 
                            alt={request.petId?.name || 'Pet'} 
                            className={styles.petPhoto} 
                          />
                          <div>
                            <h3>Request for {request.petId?.name || 'Pet'}</h3>
                            <p>From: {request.userName || 'User'}</p>
                            <p className={styles.requestDate}>
                              Received: {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className={getStatusBadgeClass(request.status)}>
                          {getStatusText(request.status)}
                        </div>
                      </div>
                      
                      <div className={styles.requestBody}>
                        <div className={styles.messageSection}>
                          <h4>Message</h4>
                          <p>{request.message}</p>
                        </div>
                        
                        <div className={styles.reasonSection}>
                          <h4>Reason for Adoption</h4>
                          <p>{request.reason}</p>
                        </div>
                        
                        <div className={styles.contactSection}>
                          <h4>Contact Information</h4>
                          <p>{request.contactInfo}</p>
                        </div>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className={styles.requestActions}>
                          <button 
                            className={styles.acceptButton}
                            onClick={() => handleStatusUpdate(request._id, 'accepted')}
                          >
                            Accept Request
                          </button>
                          
                          <button 
                            className={styles.rejectButton}
                            onClick={() => handleStatusUpdate(request._id, 'not_accepted')}
                          >
                            Decline Request
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <FaEnvelope size={40} />
                  <h3>No Received Requests</h3>
                  <p>When someone applies to adopt your pets, their requests will appear here.</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'sent' && (
            <>
              {requests.sent?.length > 0 ? (
                <div className={styles.requestsList}>
                  {(requests.sent || []).map((request, index) => (
                    <motion.div 
                      key={request._id} 
                      className={styles.requestCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={styles.requestHeader}>
                        <div className={styles.petInfo}>
                          <img 
                            src={request.petId?.photo || 'https://via.placeholder.com/150'} 
                            alt={request.petId?.name || 'Pet'} 
                            className={styles.petPhoto} 
                          />
                          <div>
                            <h3>Request for {request.petId?.name || 'Pet'}</h3>
                            <p>To: Pet Owner</p>
                            <p className={styles.requestDate}>
                              Sent: {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className={getStatusBadgeClass(request.status)}>
                          {getStatusText(request.status)}
                        </div>
                      </div>
                      
                      <div className={styles.requestBody}>
                        <div className={styles.messageSection}>
                          <h4>Your Message</h4>
                          <p>{request.message}</p>
                        </div>
                        
                        <div className={styles.reasonSection}>
                          <h4>Your Reason for Adoption</h4>
                          <p>{request.reason}</p>
                        </div>
                        
                        <div className={styles.contactSection}>
                          <h4>Your Contact Information</h4>
                          <p>{request.contactInfo}</p>
                        </div>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className={styles.requestStatus}>
                          <FaSpinner className={styles.spinnerIcon} />
                          <p>Awaiting response from the pet owner</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <FaPaperPlane size={40} />
                  <h3>No Sent Requests</h3>
                  <p>When you apply to adopt a pet, your requests will appear here.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'eventSent' && (
            <>
              {requests.eventSent?.length > 0 ? (
                <div className={styles.requestsList}>
                  {(requests.eventSent || []).map((a, index) => (
                    <motion.div 
                      key={a._id} 
                      className={styles.requestCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={styles.requestHeader}>
                        <div className={styles.petInfo}>
                          <div>
                            <h3>Event: {a.eventId?.name}</h3>
                            <p>To: Event Owner</p>
                            <p className={styles.requestDate}>Sent: {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Unknown'}</p>
                          </div>
                        </div>
                        <div className={getStatusBadgeClass(a.status)}>
                          {a.status}
                        </div>
                      </div>
                      <div className={styles.requestBody}>
                        <div className={styles.messageSection}>
                          <h4>Contact</h4>
                          <p>{a.contact}</p>
                        </div>
                        {a.notes && (
                          <div className={styles.reasonSection}>
                            <h4>Notes</h4>
                            <p>{a.notes}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <FaPaperPlane size={40} />
                  <h3>No Event Applications Sent</h3>
                </div>
              )}
            </>
          )}

          {activeTab === 'lostFoundReceived' && (
            <>
              {requests.lostFoundMessages?.filter(msg => msg.isReceived).length > 0 ? (
                <div className={styles.requestsList}>
                  {(requests.lostFoundMessages || []).filter(msg => msg.isReceived).map((conversation, index) => (
                    <motion.div 
                      key={conversation._id} 
                      className={styles.requestCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={styles.requestHeader}>
                        <div className={styles.petInfo}>
                          {conversation.petId && (
                            <img 
                              src={`http://localhost:3001/${conversation.petId.photo}`} 
                              alt={conversation.petId.petName} 
                              className={styles.petPhoto} 
                            />
                          )}
                          <div>
                            <h3>Message about: {conversation.petId ? conversation.petId.petName : 'Pet'}</h3>
                            <p>From: {conversation.senderId ? conversation.senderId.name : 'User'}</p>
                            <p className={styles.requestDate}>
                              Received: {conversation.createdAt ? new Date(conversation.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className={styles.unreadBadge}>
                            {conversation.unreadCount} new
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.requestBody}>
                        <div className={styles.messageSection}>
                          <h4>Message</h4>
                          <p>{conversation.message}</p>
                        </div>
                      </div>
                      
                      <div className={styles.requestActions}>
                        <button 
                          className={styles.acceptButton}
                          onClick={() => window.location.href = `/lost-found/chat/${conversation.conversationId}`}
                        >
                          <FaEnvelope /> Open Chat
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <FaEnvelope size={40} />
                  <h3>No Received Messages</h3>
                  <p>When someone messages you about your lost or found pet reports, they will appear here.</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'lostFoundSent' && (
            <>
              {requests.lostFoundMessages?.filter(msg => msg.isSent).length > 0 ? (
                <div className={styles.requestsList}>
                  {(requests.lostFoundMessages || []).filter(msg => msg.isSent).map((conversation, index) => (
                    <motion.div 
                      key={conversation._id} 
                      className={styles.requestCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className={styles.requestHeader}>
                        <div className={styles.petInfo}>
                          {conversation.petId && (
                            <img 
                              src={`http://localhost:3001/${conversation.petId.photo}`} 
                              alt={conversation.petId.petName} 
                              className={styles.petPhoto} 
                            />
                          )}
                          <div>
                            <h3>Message about: {conversation.petId ? conversation.petId.petName : 'Pet'}</h3>
                            <p>To: {conversation.receiverId ? conversation.receiverId.name : 'Pet Owner'}</p>
                            <p className={styles.requestDate}>
                              Sent: {conversation.createdAt ? new Date(conversation.createdAt).toLocaleDateString() : 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.requestBody}>
                        <div className={styles.messageSection}>
                          <h4>Your Message</h4>
                          <p>{conversation.message}</p>
                        </div>
                      </div>
                      
                      <div className={styles.requestActions}>
                        <button 
                          className={styles.acceptButton}
                          onClick={() => window.location.href = `/lost-found/chat/${conversation.conversationId}`}
                        >
                          <FaEnvelope /> Open Chat
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <FaPaperPlane size={40} />
                  <h3>No Sent Messages</h3>
                  <p>Messages you send about lost or found pets will appear here.</p>
                </div>
              )}
            </>
          )}
        </div>

      </div>
      
      <Footer />
    </div>
  );
};

export default Inbox;