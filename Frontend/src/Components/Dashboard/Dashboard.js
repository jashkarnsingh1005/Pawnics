import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './Dashboard.module.css';
import { FaPaw, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pets');
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showEditPetForm, setShowEditPetForm] = useState(false);
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
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Events state
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ name: '', description: '', date: '', time: '', location: '', maxParticipants: '' });
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventError, setEventError] = useState('');
  const [eventApps, setEventApps] = useState([]);

  // No sample data; fetch real data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setLoading(false);
          return;
        }

        const [petsRes, requestsRes] = await Promise.all([
          axios.get('http://localhost:3001/api/pets/my-pets', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get('http://localhost:3001/api/adoption-requests/received', {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        ]);

        setPets(petsRes.data);
        setAdoptionRequests(requestsRes.data.map(r => ({
          ...r,
          id: r._id,
          petName: r.petId?.name,
          petPhoto: r.petId?.photo,
          applicantName: r.applicantId?.name,
          date: new Date(r.createdAt || r.date).toLocaleDateString()
        })));

        // Preload events and event applications for admin view
        try {
          const [evRes, evAppsRes] = await Promise.all([
            axios.get('http://localhost:3001/api/events/my', { headers: { Authorization: `Bearer ${accessToken}` }}),
            axios.get('http://localhost:3001/api/event-applications/received', { headers: { Authorization: `Bearer ${accessToken}` }})
          ]);
          setEvents(evRes.data);
          setEventApps(evAppsRes.data.map(a => ({
            ...a,
            id: a._id,
            eventName: a.eventId?.name,
            applicantName: a.applicantId?.name,
            applicantEmail: a.applicantId?.email,
            date: new Date(a.createdAt).toLocaleDateString()
          })));
        } catch (e) {
          // non-fatal
          console.error('Failed to load events/apps', e);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchPetsOnly = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;
      const petsRes = await axios.get('http://localhost:3001/api/pets/my-pets', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPets(petsRes.data);
    } catch (error) {
      console.error('Failed to refresh pets:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', breed: '', age: '', color: '', description: '', photo: '', healthInfo: '', behavior: ''
    });
    setFormError('');
    setFormSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // removed unused demo handlers

  const handleRemovePet = async (petId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3001/api/pets/${petId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setPets(prev => prev.filter(pet => pet._id !== petId));
    } catch (error) {
      console.error('Failed to delete pet:', error);
      alert('Failed to delete pet');
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:3001/api/adoption-requests/${requestId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setAdoptionRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
      if (newStatus === 'accepted') {
        // optionally refresh pets to see adopted status
        const refreshed = await axios.get('http://localhost:3001/api/pets/my-pets', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setPets(refreshed.data);
      }
    } catch (error) {
      console.error('Failed to update request status:', error);
      alert('Failed to update request');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3001/api/adoption-requests/${requestId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setAdoptionRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Failed to delete request:', error);
      alert('Failed to delete request');
    }
  };

  const openAddPetForm = () => {
    resetForm();
    setShowAddPetForm(true);
  };

  const submitAddPet = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    const { name, breed, age, color, description, photo } = formData;
    if (!name || !breed || !age || !color || !description || !photo) {
      setFormError('Please fill in all required fields');
      setFormSubmitting(false);
      return;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post('http://localhost:3001/api/pets', {
        ...formData,
        age: Number(formData.age)
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setShowAddPetForm(false);
      resetForm();
      await fetchPetsOnly();
    } catch (error) {
      console.error('Failed to add pet:', error);
      setFormError(error.response?.data?.message || 'Failed to add pet');
      setFormSubmitting(false);
    }
  };

  const openEditPetForm = (pet) => {
    setSelectedPet(pet);
    setFormData({
      name: pet.name || '',
      breed: pet.breed || '',
      age: pet.age || '',
      color: pet.color || '',
      description: pet.description || '',
      photo: pet.photo || '',
      healthInfo: pet.healthInfo || '',
      behavior: pet.behavior || ''
    });
    setFormError('');
    setShowEditPetForm(true);
  };

  const submitEditPet = async (e) => {
    e.preventDefault();
    if (!selectedPet) return;
    setFormError('');
    setFormSubmitting(true);
    const { name, breed, age, color, description, photo } = formData;
    if (!name || !breed || !age || !color || !description || !photo) {
      setFormError('Please fill in all required fields');
      setFormSubmitting(false);
      return;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:3001/api/pets/${selectedPet._id}`, {
        ...formData,
        age: Number(formData.age)
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setShowEditPetForm(false);
      setSelectedPet(null);
      resetForm();
      await fetchPetsOnly();
    } catch (error) {
      console.error('Failed to update pet:', error);
      setFormError(error.response?.data?.message || 'Failed to update pet');
      setFormSubmitting(false);
    }
  };

  // Events helpers
  const refreshEventsOnly = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const evRes = await axios.get('http://localhost:3001/api/events/my', { headers: { Authorization: `Bearer ${accessToken}` }});
      setEvents(evRes.data);
    } catch (e) { console.error(e); }
  };

  const refreshEventAppsOnly = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:3001/api/event-applications/received', { headers: { Authorization: `Bearer ${accessToken}` }});
      setEventApps(res.data.map(a => ({ ...a, id: a._id, eventName: a.eventId?.name, applicantName: a.applicantId?.name, applicantEmail: a.applicantId?.email, date: new Date(a.createdAt).toLocaleDateString() })));
    } catch (e) { console.error(e); }
  };

  const submitEvent = async (e) => {
    e.preventDefault();
    setEventError('');
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (editingEvent) {
        await axios.put(`http://localhost:3001/api/events/${editingEvent._id}`, { ...eventForm, maxParticipants: Number(eventForm.maxParticipants) }, { headers: { Authorization: `Bearer ${accessToken}` }});
      } else {
        await axios.post('http://localhost:3001/api/events', { ...eventForm, maxParticipants: Number(eventForm.maxParticipants) }, { headers: { Authorization: `Bearer ${accessToken}` }});
      }
      setEventForm({ name: '', description: '', date: '', time: '', location: '', maxParticipants: '' });
      setEditingEvent(null);
      await refreshEventsOnly();
    } catch (err) {
      setEventError(err.response?.data?.message || 'Failed to save event');
    }
  };

  const editEvent = (ev) => {
    setEditingEvent(ev);
    setEventForm({ name: ev.name || '', description: ev.description || '', date: ev.date || '', time: ev.time || '', location: ev.location || '', maxParticipants: (ev.maxParticipants?.toString() || '') });
  };

  const deleteEvent = async (id) => {
    const accessToken = localStorage.getItem('accessToken');
    await axios.delete(`http://localhost:3001/api/events/${id}`, { headers: { Authorization: `Bearer ${accessToken}` }});
    await refreshEventsOnly();
  };

  const updateEventApplication = async (id, status) => {
    const accessToken = localStorage.getItem('accessToken');
    await axios.put(`http://localhost:3001/api/event-applications/${id}`, { status }, { headers: { Authorization: `Bearer ${accessToken}` }});
    await refreshEventAppsOnly();
  };

  const deleteEventApplication = async (id) => {
    const accessToken = localStorage.getItem('accessToken');
    await axios.delete(`http://localhost:3001/api/event-applications/${id}`, { headers: { Authorization: `Bearer ${accessToken}` }});
    await refreshEventAppsOnly();
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
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <Navbar />
      
      <div className={styles.container}>
        <motion.div 
          className={styles.dashboardHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Admin Dashboard</h1>
          <p>Manage pets and adoption requests</p>
        </motion.div>
        
        <div className={styles.dashboardContent}>
          <div className={styles.sidebar}>
            <button className={`${styles.sidebarButton} ${activeTab === 'pets' ? styles.activeButton : ''}`} onClick={() => setActiveTab('pets')}>
              <FaPaw /> Manage Pets
            </button>
            <button className={`${styles.sidebarButton} ${activeTab === 'events' ? styles.activeButton : ''}`} onClick={() => setActiveTab('events')}>
              🗓️ Volunteer Events
            </button>
          </div>
          
          <div className={styles.mainContent}>
            {activeTab === 'pets' && (
            <>
            <div className={styles.sectionHeader}>
              <h2>All Pets</h2>
              <motion.button 
                className={styles.addButton}
                onClick={openAddPetForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus /> Add New Pet
              </motion.button>
            </div>
            
            <div className={styles.petsGrid}>
              {pets.map(pet => (
                <motion.div 
                  key={pet._id} 
                  className={styles.petCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                >
                  <div className={styles.petImageContainer}>
                    <img src={pet.photo} alt={pet.name} className={styles.petImage} />
                  </div>
                  <div className={styles.petInfo}>
                    <h3>{pet.name}</h3>
                    <p><strong>Breed:</strong> {pet.breed}</p>
                    <p><strong>Age:</strong> {pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                    <p><strong>Color:</strong> {pet.color}</p>
                    <p className={styles.addedBy}>
                      <strong>Added by:</strong> {pet.addedBy === 'admin' ? 'Admin' : pet.ownerName}
                    </p>
                    
                    <div className={styles.petActions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => openEditPetForm(pet)}
                      >
                        <FaEdit /> Edit
                      </button>
                      
                      <button 
                        className={styles.removeButton}
                        onClick={() => handleRemovePet(pet._id)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className={styles.sectionHeader}>
              <h2>Adoption Requests</h2>
            </div>
            
            <div className={styles.requestsList}>
              {adoptionRequests.length > 0 ? (
                adoptionRequests.map(request => (
                  <motion.div 
                    key={request.id} 
                    className={styles.requestCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={styles.requestHeader}>
                      <div className={styles.requestPetInfo}>
                        <img src={request.petPhoto} alt={request.petName} className={styles.petPhoto} />
                        <div>
                          <h3>Request for {request.petName}</h3>
                          <p>From: {request.applicantName}</p>
                          <p>To: {request.ownerName}</p>
                          <p className={styles.requestDate}>Date: {request.date}</p>
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
                    
                    <div className={styles.requestActions}>
                    {request.status === 'pending' && (
                        <>
                        <button 
                          className={styles.acceptButton}
                          onClick={() => handleStatusUpdate(request.id, 'accepted')}
                        >
                          <FaCheck /> Accept Request
                        </button>
                        
                        <button 
                          className={styles.rejectButton}
                          onClick={() => handleStatusUpdate(request.id, 'not_accepted')}
                        >
                          <FaTimes /> Decline Request
                          </button>
                        </>
                      )}
                      <button 
                        className={styles.deleteRequestButton}
                        onClick={() => handleDeleteRequest(request.id)}
                      >
                        <FaTrash /> Delete
                        </button>
                      </div>
                  </motion.div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No adoption requests found.</p>
                </div>
              )}
            </div>
            </>
            )}

            {activeTab === 'events' && (
              <>
                <div className={styles.sectionHeader}>
                  <h2>Volunteer Events</h2>
                </div>
                {eventError && <div className={styles.errorAlert}>{eventError}</div>}
                <form onSubmit={submitEvent} className={styles.form}>
                  <div className={styles.formRow}>
                    <input name="name" value={eventForm.name} onChange={e => setEventForm({ ...eventForm, name: e.target.value })} placeholder="Event Name*" />
                    <input name="location" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Location*" />
                  </div>
                  <textarea name="description" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Description*" />
                  <div className={styles.formRow}>
                    <input type="date" name="date" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} />
                    <input type="time" name="time" value={eventForm.time} onChange={e => setEventForm({ ...eventForm, time: e.target.value })} />
                    <input type="number" name="maxParticipants" value={eventForm.maxParticipants} onChange={e => setEventForm({ ...eventForm, maxParticipants: e.target.value })} placeholder="Max Participants*" />
                  </div>
                  <div className={styles.modalActions}>
                    {editingEvent && <button type="button" onClick={() => { setEditingEvent(null); setEventForm({ name: '', description: '', date: '', time: '', location: '', maxParticipants: '' }); }}>Cancel</button>}
                    <button type="submit">{editingEvent ? 'Save Changes' : 'Add Event'}</button>
                  </div>
                </form>

                <div className={styles.sectionHeader}>
                  <h2>My Events</h2>
                </div>
                <div className={styles.table}> 
                  <div className={styles.thead}><div>Name</div><div>Date</div><div>Time</div><div>Location</div><div>Max</div><div>Actions</div></div>
                  {events.map(ev => (
                    <div key={ev._id} className={styles.trow}>
                      <div>{ev.name}</div><div>{ev.date}</div><div>{ev.time}</div><div>{ev.location}</div><div>{ev.maxParticipants}</div>
                      <div className={styles.rowActions}>
                        <button onClick={() => editEvent(ev)}>Edit</button>
                        <button className={styles.deleteButton} onClick={() => deleteEvent(ev._id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.sectionHeader}>
                  <h2>Event Applications</h2>
                </div>
                <div className={styles.table}>
                  <div className={styles.thead}><div>Event</div><div>Applicant</div><div>Email</div><div>Status</div><div>Date</div><div>Actions</div></div>
                  {eventApps.map(a => (
                    <div key={a.id} className={styles.trow}>
                      <div>{a.eventName}</div><div>{a.applicantName}</div><div>{a.applicantEmail}</div><div>{a.status}</div><div>{a.date}</div>
                      <div className={styles.rowActions}>
                        {a.status === 'pending' && (
                          <>
                            <button onClick={() => updateEventApplication(a.id, 'accepted')}>Accept</button>
                            <button onClick={() => updateEventApplication(a.id, 'declined')}>Decline</button>
                          </>
                        )}
                        <button className={styles.deleteButton} onClick={() => deleteEventApplication(a.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {showAddPetForm && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h2>Add a New Pet</h2>
            {formError && <div className={styles.errorAlert}>{formError}</div>}
            <form onSubmit={submitAddPet} className={styles.form}>
              <div className={styles.formRow}>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name*" />
                <input name="breed" value={formData.breed} onChange={handleInputChange} placeholder="Breed*" />
              </div>
              <div className={styles.formRow}>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age*" />
                <input name="color" value={formData.color} onChange={handleInputChange} placeholder="Color*" />
              </div>
              <input name="photo" value={formData.photo} onChange={handleInputChange} placeholder="Photo URL*" />
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description*" />
              <textarea name="healthInfo" value={formData.healthInfo} onChange={handleInputChange} placeholder="Health Info" />
              <textarea name="behavior" value={formData.behavior} onChange={handleInputChange} placeholder="Behavior" />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowAddPetForm(false)}>Cancel</button>
                <button type="submit" disabled={formSubmitting}>{formSubmitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {showEditPetForm && selectedPet && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h2>Edit Pet: {selectedPet.name}</h2>
            {formError && <div className={styles.errorAlert}>{formError}</div>}
            <form onSubmit={submitEditPet} className={styles.form}>
              <div className={styles.formRow}>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name*" />
                <input name="breed" value={formData.breed} onChange={handleInputChange} placeholder="Breed*" />
              </div>
              <div className={styles.formRow}>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age*" />
                <input name="color" value={formData.color} onChange={handleInputChange} placeholder="Color*" />
              </div>
              <input name="photo" value={formData.photo} onChange={handleInputChange} placeholder="Photo URL*" />
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description*" />
              <textarea name="healthInfo" value={formData.healthInfo} onChange={handleInputChange} placeholder="Health Info" />
              <textarea name="behavior" value={formData.behavior} onChange={handleInputChange} placeholder="Behavior" />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => { setShowEditPetForm(false); setSelectedPet(null); }}>Cancel</button>
                <button type="submit" disabled={formSubmitting}>{formSubmitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Dashboard;