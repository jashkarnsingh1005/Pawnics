import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './ManagePets.module.css';
import { FaPaw, FaPlus, FaTrash, FaEdit, FaArrowLeft } from 'react-icons/fa';

const ManagePets = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [showEditPetForm, setShowEditPetForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    color: '',
    description: '',
    photo: '',
    healthInfo: '',
    behavior: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to fetch user details and pets
  const fetchUserDetailsAndPets = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/api/auth/getUserDetails', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(response.data);
      await fetchUserPets(accessToken, response.data._id);
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchUserDetailsAndPets();
  }, [navigate]);

  const fetchUserPets = async (token, userId) => {
    try {
      console.log('Fetching pets for user...');
      const response = await axios.get(`http://localhost:3001/api/pets/my-pets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Pets fetched successfully:', response.data);
      setPets(response.data);
      setLoading(false);
      return response.data; // Return the data for potential chaining
    } catch (error) {
      console.error('Error fetching pets:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      setPets([]); // Set empty array on error
      setLoading(false);
      return []; // Return empty array on error
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      breed: '',
      age: '',
      color: '',
      description: '',
      photo: '',
      healthInfo: '',
      behavior: ''
    });
    setError('');
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name || !formData.breed || !formData.age || !formData.color || !formData.description || !formData.photo) {
      setError('Please fill in all required fields');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/pets', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Pet added successfully:', response.data);
      
      // Refresh the pets list from the server instead of just adding to the local state
      await fetchUserDetailsAndPets();
      
      setShowAddPetForm(false);
      resetForm();
      setSuccess('Pet added successfully!');
    } catch (error) {
      console.error('Error adding pet:', error);
      setError(error.response?.data?.message || 'Failed to add pet');
    }
  };

  const handleEditClick = (pet) => {
    // Store the pet we're editing
    setSelectedPet(pet);
    
    // Create the updated form data
    const updatedFormData = {
      name: pet.name || '',
      breed: pet.breed || '',
      age: pet.age || '',
      color: pet.color || '',
      description: pet.description || '',
      photo: pet.photo || '',
      healthInfo: pet.healthInfo || '',
      behavior: pet.behavior || ''
    };
    
    // Set the form data with pet details
    setFormData(updatedFormData);
    
    // Show the edit form and hide the add form
    setShowEditPetForm(true);
    setShowAddPetForm(false);
    
    // Log to verify data is being set correctly
    console.log('Editing pet:', pet);
    console.log('Form data being set:', updatedFormData);
  };

  const handleEditPet = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name || !formData.breed || !formData.age || !formData.color || !formData.description || !formData.photo) {
      setError('Please fill in all required fields');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      console.log('Submitting updated pet data:', formData);
      console.log('For pet ID:', selectedPet._id);
      
      const response = await axios.put(`http://localhost:3001/api/pets/${selectedPet._id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Update response:', response.data);
      
      // Refresh the pets list from the server instead of just updating the local state
      await fetchUserDetailsAndPets();
      
      setShowEditPetForm(false);
      setSelectedPet(null);
      resetForm();
      setSuccess('Pet updated successfully!');
    } catch (error) {
      console.error('Error updating pet:', error);
      setError(error.response?.data?.message || 'Failed to update pet');
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/pets/${petId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Refresh the pets list from the server instead of just filtering the local state
      await fetchUserDetailsAndPets();
      setSuccess('Pet deleted successfully!');
    } catch (error) {
      console.error('Error deleting pet:', error);
      setError(error.response?.data?.message || 'Failed to delete pet');
    }
  };

  const handleCancelEdit = () => {
    setShowEditPetForm(false);
    setSelectedPet(null);
    resetForm();
  };

  return (
    <div className={styles.managePetsPage}>
      <Navbar />
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1><FaPaw /> Manage My Pets</h1>
          <p>Add, edit, or remove your pets available for adoption</p>
        </motion.div>

        {error && <div className={styles.errorAlert}>{error}</div>}
        {success && <div className={styles.successAlert}>{success}</div>}

        <div className={styles.actionsBar}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate('/adoption')}
          >
            <FaArrowLeft /> Back to Adoption
          </button>
          <button 
            className={styles.addButton} 
            onClick={() => {
              setShowAddPetForm(!showAddPetForm);
              setShowEditPetForm(false);
              resetForm();
            }}
          >
            <FaPlus /> {showAddPetForm ? 'Cancel' : 'Add New Pet'}
          </button>
        </div>

        {showAddPetForm && (
          <motion.div 
            className={styles.formContainer}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h2>Add New Pet</h2>
            <form onSubmit={handleAddPet}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Pet Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter pet name"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="breed">Breed*</label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    placeholder="Enter breed"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="age">Age*</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                    min="0"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="color">Color*</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="Enter color"
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="photo">Photo URL*</label>
                <input
                  type="text"
                  id="photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  placeholder="Enter photo URL"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter pet description"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="healthInfo">Health Information</label>
                <textarea
                  id="healthInfo"
                  name="healthInfo"
                  value={formData.healthInfo}
                  onChange={handleInputChange}
                  placeholder="Enter health information"
                  rows="2"
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="behavior">Behavior</label>
                <textarea
                  id="behavior"
                  name="behavior"
                  value={formData.behavior}
                  onChange={handleInputChange}
                  placeholder="Enter behavior information"
                  rows="2"
                ></textarea>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>Add Pet</button>
                <button type="button" className={styles.cancelButton} onClick={() => setShowAddPetForm(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        {showEditPetForm && selectedPet && (
          <motion.div 
            className={styles.formContainer}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h2>Edit Pet</h2>
            <form onSubmit={handleEditPet}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Pet Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter pet name"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="breed">Breed*</label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    placeholder="Enter breed"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="age">Age*</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                    min="0"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="color">Color*</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="Enter color"
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="photo">Photo URL*</label>
                <input
                  type="text"
                  id="photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  placeholder="Enter photo URL"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter pet description"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="healthInfo">Health Information</label>
                <textarea
                  id="healthInfo"
                  name="healthInfo"
                  value={formData.healthInfo}
                  onChange={handleInputChange}
                  placeholder="Enter health information"
                  rows="2"
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="behavior">Behavior</label>
                <textarea
                  id="behavior"
                  name="behavior"
                  value={formData.behavior}
                  onChange={handleInputChange}
                  placeholder="Enter behavior information"
                  rows="2"
                ></textarea>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>Update Pet</button>
                <button type="button" className={styles.cancelButton} onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}

        <div className={styles.petsContainer}>
          {loading ? (
            <div className={styles.loading}>Loading your pets...</div>
          ) : pets.length === 0 ? (
            <div className={styles.noPets}>
              <p>You haven't added any pets yet.</p>
              <button 
                className={styles.addFirstPetButton} 
                onClick={() => setShowAddPetForm(true)}
              >
                <FaPlus /> Add Your First Pet
              </button>
            </div>
          ) : (
            <div className={styles.petsList}>
              {pets.map((pet) => (
                <motion.div 
                  key={pet._id} 
                  className={styles.petCard}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.petImageContainer}>
                    <img src={pet.photo} alt={pet.name} className={styles.petImage} />
                  </div>
                  <div className={styles.petInfo}>
                    <h3>{pet.name}</h3>
                    <p><strong>Breed:</strong> {pet.breed}</p>
                    <p><strong>Age:</strong> {pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                    <p><strong>Color:</strong> {pet.color}</p>
                    <div className={styles.petActions}>
                      <button 
                        className={styles.editButton} 
                        onClick={() => handleEditClick(pet)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className={styles.deleteButton} 
                        onClick={() => handleDeletePet(pet._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManagePets;