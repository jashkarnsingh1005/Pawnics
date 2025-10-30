import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './PetDetails.module.css';
import { FaPaw, FaArrowLeft } from 'react-icons/fa';

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [adoptionForm, setAdoptionForm] = useState({
    message: '',
    reason: '',
    contactInfo: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);


  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const response = await axios.get('http://localhost:3001/api/auth/getUserDetails', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Fetch pet details from API
    const fetchPetDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/pets/${id}`);
        setPet(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pet details:', error);
        navigate('/adoption');
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchPetDetails();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdoptionForm({
      ...adoptionForm,
      [name]: value
    });
  };

  const handleAdoptionSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('You must be logged in to submit an adoption request');
      setFormSubmitting(false);
      return;
    }
    
    try {
      const requestData = {
        petId: pet._id,
        message: adoptionForm.message,
        reason: adoptionForm.reason,
        contactInfo: adoptionForm.contactInfo
      };
      
      await axios.post('http://localhost:3001/api/adoption-requests', requestData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      setFormSubmitting(false);
      setFormSubmitted(true);
      setShowAdoptionForm(false);
      
      // Show success message
      alert('Your adoption request has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting adoption request:', error);
      alert('Failed to submit adoption request. Please try again.');
      setFormSubmitting(false);
    }
  };

  const isOwner = () => {
    return user && pet && (user._id === (pet.ownerId?._id || pet.ownerId) || user.role === 'admin');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading pet details...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Pet not found</h2>
        <button onClick={() => navigate('/adoption')} className={styles.backButton}>
          <FaArrowLeft /> Back to Adoption
        </button>
      </div>
    );
  }

  return (
    <div className={styles.petDetailsPage}>
      <Navbar />
      
      <div className={styles.container}>
        <motion.button 
          className={styles.backButton}
          onClick={() => navigate('/adoption')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaArrowLeft /> Back to Adoption
        </motion.button>
        
        <div className={styles.petDetailsContainer}>
          <motion.div 
            className={styles.petImageSection}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src={pet.photo} alt={pet.name} className={styles.petImage} />
          </motion.div>
          
          <motion.div 
            className={styles.petInfoSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.petHeader}>
              <h1>{pet.name}</h1>
            </div>
            
            <div className={styles.petAttributes}>
              <div className={styles.attribute}>
                <span className={styles.attributeLabel}>Breed</span>
                <span className={styles.attributeValue}>{pet.breed}</span>
              </div>
              
              <div className={styles.attribute}>
                <span className={styles.attributeLabel}>Age</span>
                <span className={styles.attributeValue}>{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
              </div>
              
              <div className={styles.attribute}>
                <span className={styles.attributeLabel}>Color</span>
                <span className={styles.attributeValue}>{pet.color}</span>
              </div>
              
              <div className={styles.attribute}>
                <span className={styles.attributeLabel}>Added On</span>
                <span className={styles.attributeValue}>{pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
            
            <div className={styles.petDescription}>
              <h3>About {pet.name}</h3>
              <p>{pet.description}</p>
            </div>
            
            <div className={styles.petExtraInfo}>
              {pet.healthInfo && (
                <div className={styles.infoSection}>
                  <h3>Health Information</h3>
                  <p>{pet.healthInfo}</p>
                </div>
              )}
              
              {pet.behavior && (
                <div className={styles.infoSection}>
                  <h3>Behavior</h3>
                  <p>{pet.behavior}</p>
                </div>
              )}
            </div>
            
            {!isOwner() && !formSubmitted && pet.status !== 'adopted' && (
              <motion.button 
                className={styles.adoptButton}
                onClick={() => setShowAdoptionForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <FaPaw /> Apply for Adoption
              </motion.button>
            )}
            
            {formSubmitted && (
              <div className={styles.submittedMessage}>
                <p>Your adoption request has been submitted!</p>
                <p>You can check its status in your inbox.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {showAdoptionForm && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h2>Apply to Adopt {pet.name}</h2>
            
            <form onSubmit={handleAdoptionSubmit} className={styles.adoptionForm}>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message to Owner</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={adoptionForm.message} 
                  onChange={handleInputChange} 
                  placeholder="Introduce yourself to the pet owner..."
                  required
                ></textarea>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="reason">Why do you want to adopt {pet.name}?</label>
                <textarea 
                  id="reason" 
                  name="reason" 
                  value={adoptionForm.reason} 
                  onChange={handleInputChange} 
                  placeholder="Tell us why you'd be a good match for this pet..."
                  required
                ></textarea>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="contactInfo">Additional Contact Information</label>
                <input 
                  type="text" 
                  id="contactInfo" 
                  name="contactInfo" 
                  value={adoptionForm.contactInfo} 
                  onChange={handleInputChange} 
                  placeholder="Phone number, alternative email, etc."
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  onClick={() => setShowAdoptionForm(false)} 
                  className={styles.cancelButton}
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default PetDetails;