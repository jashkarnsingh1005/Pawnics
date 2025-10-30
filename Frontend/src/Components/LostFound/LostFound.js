import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import MapIntegration from './MapIntegration';
import MyReports from './MyReports';
import styles from './LostFound.module.css';
import { FaSearch, FaPlus, FaEnvelope, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const LostFound = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [contactMessage, setContactMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    petType: '',
    breed: ''
  });
  const [reportForm, setReportForm] = useState({
    type: 'lost',
    petName: '',
    petType: 'dog',
    breed: '',
    color: '',
    description: '',
    photo: null,
    contactInfo: {
      name: '',
      phone: '',
      email: ''
    },
    location: {
      lat: 0,
      lng: 0,
      address: ''
    }
  });

  const fetchCurrentUser = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    
    try {
      const response = await axios.get('http://localhost:3001/api/auth/getUserDetails', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.petType) params.append('petType', filters.petType);
      if (filters.breed) params.append('breed', filters.breed);
      
      const response = await axios.get(`http://localhost:3001/api/lost-found-pets?${params}`);
      setPets(response.data.pets || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setPets([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchPets();
  }, []);

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      alert('Please login to report a pet');
      return;
    }

    const formData = new FormData();
    formData.append('type', reportForm.type);
    formData.append('petName', reportForm.petName);
    formData.append('petType', reportForm.petType);
    formData.append('breed', reportForm.breed);
    formData.append('color', reportForm.color);
    formData.append('description', reportForm.description);
    formData.append('photo', reportForm.photo);
    formData.append('contactInfo', JSON.stringify(reportForm.contactInfo));
    formData.append('location', JSON.stringify(reportForm.location));

    try {
      await axios.post('http://localhost:3001/api/lost-found-pets', formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Pet report submitted successfully!');
      setShowReportForm(false);
      setReportForm({
        type: 'lost',
        petName: '',
        petType: 'dog',
        breed: '',
        color: '',
        description: '',
        photo: null,
        contactInfo: { name: '', phone: '', email: '' },
        location: { lat: 0, lng: 0, address: '' }
      });
      fetchPets();
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleContactOwner = (pet) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('Please login to contact the owner');
      return;
    }
    
    setSelectedPet(pet);
    setShowContactModal(true);
  };

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    
    try {
      console.log('Sending message with data:', {
        petId: selectedPet._id,
        receiverId: selectedPet.userId._id,
        message: contactMessage
      });

      const response = await axios.post('http://localhost:3001/api/lost-found-messages', {
        petId: selectedPet._id,
        receiverId: selectedPet.userId._id,
        message: contactMessage
      }, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      console.log('Response received:', response.data);
      
      if (response.data.success) {
        alert('Message sent successfully!');
        setShowContactModal(false);
        setContactMessage('');
        setSelectedPet(null);
        
        // Redirect to inbox to see the sent message
        setTimeout(() => {
          window.location.href = '/inbox';
        }, 1000);
      } else {
        console.error('Server returned error:', response.data);
        alert(`Failed to send message: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        alert(`Failed to send message: ${error.response.data.message}`);
      } else {
        alert('Failed to send message. Please check console for details.');
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportForm(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          
          // Reverse geocoding to get address
          fetch(`https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results[0]) {
                setReportForm(prev => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    address: data.results[0].formatted
                  }
                }));
              }
            })
            .catch(err => console.log('Geocoding error:', err));
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enter address manually.');
        }
      );
    }
  };

  return (
    <div className={styles.lostFoundPage}>
      <Navbar />
      
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Lost & Found Pets</h1>
          <p>Help reunite pets with their families</p>
        </div>
      </div>
      
      <div className={styles.container}>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'browse' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              <FaSearch /> Browse Pets
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'report' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('report')}
            >
              <FaPlus /> Report Pet
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'myReports' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('myReports')}
            >
              <FaUser /> My Reports
            </button>
          </div>
        </div>

        {activeTab === 'myReports' && (
          <MyReports />
        )}

        {activeTab === 'browse' && (
          <div className={styles.browseSection}>
            <div className={styles.filtersContainer}>
              <div className={styles.filters}>
                <select 
                  value={filters.type} 
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className={styles.filterSelect}
                >
                  <option value="">All Types</option>
                  <option value="lost">Lost Pets</option>
                  <option value="found">Found Pets</option>
                </select>
                
                <select 
                  value={filters.petType} 
                  onChange={(e) => setFilters({...filters, petType: e.target.value})}
                  className={styles.filterSelect}
                >
                  <option value="">All Animals</option>
                  <option value="dog">Dogs</option>
                  <option value="cat">Cats</option>
                  <option value="bird">Birds</option>
                  <option value="rabbit">Rabbits</option>
                  <option value="other">Other</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Search by breed..."
                  value={filters.breed}
                  onChange={(e) => setFilters({...filters, breed: e.target.value})}
                  className={styles.filterInput}
                />
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading pets...</p>
              </div>
            ) : pets.length === 0 ? (
              <div className={styles.noResults}>
                <h3>No results found</h3>
                <p>No pets match your current filters. Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className={styles.petsGrid}>
                {pets.map((pet, index) => (
                  <motion.div 
                    key={pet._id} 
                    className={`${styles.petCard} ${styles[pet.type]}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className={styles.petImage}>
                      <img src={`http://localhost:3001/${pet.photo}`} alt={pet.petName} />
                      <div className={`${styles.statusBadge} ${styles[pet.type]}`}>
                        {pet.type === 'lost' ? 'LOST' : 'FOUND'}
                      </div>
                    </div>
                    
                    <div className={styles.petInfo}>
                      <h3>{pet.petName}</h3>
                      <p className={styles.petDetails}>
                        {pet.breed} • {pet.color} • {pet.petType}
                      </p>
                      <p className={styles.description}>{pet.description}</p>
                      
                      <div className={styles.locationInfo}>
                        <FaMapMarkerAlt />
                        <span>{pet.location.address}</span>
                      </div>
                      
                      <div className={styles.contactInfo}>
                        <div className={styles.reportedBy}>
                          Reported by: {pet.userId.name}
                        </div>
                        <div className={styles.reportDate}>
                          {new Date(pet.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {currentUser && currentUser._id !== pet.userId._id && (
                        <button 
                          className={styles.contactBtn}
                          onClick={() => handleContactOwner(pet)}
                        >
                          <FaEnvelope /> Contact Owner
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && pets.length === 0 && (
              <div className={styles.emptyState}>
                <FaSearch size={40} />
                <h3>No pets found</h3>
                <p>Try adjusting your filters or check back later.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'report' && (
          <div className={styles.reportSection}>
            <motion.form 
              className={styles.reportForm}
              onSubmit={handleReportSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.formGroup}>
                <label>Report Type</label>
                <select 
                  value={reportForm.type}
                  onChange={(e) => setReportForm({...reportForm, type: e.target.value})}
                  required
                >
                  <option value="lost">Lost Pet</option>
                  <option value="found">Found Pet</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Pet Name</label>
                  <input
                    type="text"
                    value={reportForm.petName}
                    onChange={(e) => setReportForm({...reportForm, petName: e.target.value})}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Pet Type</label>
                  <select 
                    value={reportForm.petType}
                    onChange={(e) => setReportForm({...reportForm, petType: e.target.value})}
                    required
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Breed</label>
                  <input
                    type="text"
                    value={reportForm.breed}
                    onChange={(e) => setReportForm({...reportForm, breed: e.target.value})}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Color</label>
                  <input
                    type="text"
                    value={reportForm.color}
                    onChange={(e) => setReportForm({...reportForm, color: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Pet Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReportForm({...reportForm, photo: e.target.files[0]})}
                  required
                />
              </div>

              <div className={styles.contactSection}>
                <h3>Contact Information</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Your Name</label>
                    <input
                      type="text"
                      value={reportForm.contactInfo.name}
                      onChange={(e) => setReportForm({
                        ...reportForm, 
                        contactInfo: {...reportForm.contactInfo, name: e.target.value}
                      })}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={reportForm.contactInfo.phone}
                      onChange={(e) => setReportForm({
                        ...reportForm, 
                        contactInfo: {...reportForm.contactInfo, phone: e.target.value}
                      })}
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={reportForm.contactInfo.email}
                    onChange={(e) => setReportForm({
                      ...reportForm, 
                      contactInfo: {...reportForm.contactInfo, email: e.target.value}
                    })}
                    required
                  />
                </div>
              </div>

              <div className={styles.locationSection}>
                <h3>Location</h3>
                <MapIntegration
                  onLocationSelect={(location) => setReportForm({
                    ...reportForm,
                    location: location
                  })}
                  initialLocation={reportForm.location}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Submit Report
              </button>
            </motion.form>
          </div>
        )}

        {/* Contact Owner Modal */}
        {showContactModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h3>Contact Owner</h3>
                <button 
                  className={styles.closeBtn}
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedPet(null);
                    setContactMessage('');
                  }}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.modalBody}>
                {selectedPet && (
                  <div className={styles.petInfo}>
                    <img 
                      src={`http://localhost:3001/${selectedPet.photo}`} 
                      alt={selectedPet.petName}
                      className={styles.petPhoto}
                    />
                    <div>
                      <h4>{selectedPet.petName}</h4>
                      <p>{selectedPet.type === 'lost' ? 'Lost Pet' : 'Found Pet'}</p>
                      <p>{selectedPet.breed} • {selectedPet.color}</p>
                    </div>
                  </div>
                )}
                
                <div className={styles.formGroup}>
                  <label>Your Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Write your message to the pet owner..."
                    rows="4"
                    className={styles.messageTextarea}
                  />
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button 
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedPet(null);
                    setContactMessage('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className={styles.sendBtn}
                  onClick={handleSendMessage}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default LostFound;
