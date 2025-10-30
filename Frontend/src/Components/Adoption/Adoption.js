import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './Adoption.module.css';
import { FaFilter, FaPlus, FaSearch } from 'react-icons/fa';

const Adoption = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    breed: '',
    age: '',
    color: ''
  });
  const [searchTerm, setSearchTerm] = useState('');


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

    // Fetch pets from API
    const fetchPets = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:3001/api/pets', {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
        });
        setPets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setPets([]);
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchPets();
  }, []);

  // Pet management is now handled in the ManagePets component

  const handleRemovePet = async (petId) => {
    if (!window.confirm('Are you sure you want to remove this pet?')) return;
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      await axios.delete(`http://localhost:3001/api/pets/${petId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPets(pets.filter(pet => pet._id !== petId));
    } catch (error) {
      console.error('Error removing pet:', error);
      alert('Failed to remove pet. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPets = pets.filter(pet => {
    const matchesBreed = !filters.breed || (pet.breed && pet.breed.toLowerCase().includes(filters.breed.toLowerCase()));
    const matchesAge = !filters.age || (pet.age && pet.age.toString() === filters.age);
    const matchesColor = !filters.color || (pet.color && pet.color.toLowerCase().includes(filters.color.toLowerCase()));
    const matchesSearch = !searchTerm || 
      (pet.name && pet.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.description && pet.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesBreed && matchesAge && matchesColor && matchesSearch;
  });

  const canRemovePet = (pet) => {
    return user && (user._id === pet.ownerId || user.role === 'admin');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading pets...</p>
      </div>
    );
  }

  return (
    <div className={styles.adoptionPage}>
      <Navbar />
      
      <motion.div 
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroContent}>
          <h1>Find Your Perfect Companion</h1>
          <p>Browse our available pets and give them a loving home</p>
        </div>
      </motion.div>

      <div className={styles.container}>

        <div className={styles.filtersContainer}>
          <div className={styles.filters}>
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search pets..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.filterSelect}
              />
            </div>
            
            <select 
              name="breed" 
              value={filters.breed} 
              onChange={handleFilterChange} 
              className={styles.filterSelect}
            >
              <option value="">All Breeds</option>
              <option value="Labrador">Labrador</option>
              <option value="Golden Retriever">Golden Retriever</option>
              <option value="German Shepherd">German Shepherd</option>
              <option value="Persian">Persian</option>
              <option value="Siamese">Siamese</option>
              <option value="Mixed">Mixed Breed</option>
            </select>
            
            <select name="age" value={filters.age} onChange={handleFilterChange} className={styles.filterSelect}>
              <option value="">All Ages</option>
              <option value="0">Less than 1 year</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4+ years</option>
            </select>
            
            <input 
              type="text" 
              name="color" 
              value={filters.color} 
              onChange={handleFilterChange} 
              placeholder="Filter by color"
              className={styles.filterSelect}
            />
            
            <Link to="/manage-pets">
              <motion.button 
                className={styles.managePetsBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus /> Manage Pets
              </motion.button>
            </Link>
          </div>
        </div>

        <div className={styles.petsGrid}>
          {filteredPets.length > 0 ? (
            filteredPets.map(pet => (
              <motion.div 
                key={pet._id} 
                className={styles.petCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              >
                <div className={styles.petImageContainer}>
                  {pet.status === 'adopted' && (
                    <div className={styles.adoptedBadge}>Adopted</div>
                  )}
                  <img src={pet.photo} alt={pet.name} className={styles.petImage} />
                </div>
                <div className={styles.petInfo}>
                  <h3>{pet.name}</h3>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                  <p><strong>Color:</strong> {pet.color}</p>
                  
                  <div className={styles.petActions}>
                    <Link to={`/adoption/${pet._id}`} className={styles.viewDetailsButton}>
                      View Details
                    </Link>
                    
                    {canRemovePet(pet) && (
                      <button 
                        className={styles.removeButton}
                        onClick={() => handleRemovePet(pet._id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={styles.noPets}>
              <p>No pets found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>



      <Footer />
    </div>
  );
};

export default Adoption;