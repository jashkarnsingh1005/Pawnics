import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from './MyReports.module.css';
import { FaEdit, FaTrash, FaCheck, FaEye, FaMapMarkerAlt } from 'react-icons/fa';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/api/lost-found-pets/my-reports', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
    setLoading(false);
  };

  const handleEdit = (report) => {
    setEditingReport(report._id);
    setEditForm({
      petName: report.petName,
      breed: report.breed,
      color: report.color,
      description: report.description,
      contactInfo: report.contactInfo,
      location: report.location,
      status: report.status
    });
  };

  const handleUpdate = async (reportId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      const formData = new FormData();
      Object.keys(editForm).forEach(key => {
        if (key === 'contactInfo' || key === 'location') {
          formData.append(key, JSON.stringify(editForm[key]));
        } else {
          formData.append(key, editForm[key]);
        }
      });

      await axios.put(`http://localhost:3001/api/lost-found-pets/${reportId}`, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Report updated successfully!');
      setEditingReport(null);
      fetchMyReports();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Failed to update report. Please try again.');
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    
    try {
      await axios.delete(`http://localhost:3001/api/lost-found-pets/${reportId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      alert('Report deleted successfully!');
      fetchMyReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report. Please try again.');
    }
  };

  const handleMarkResolved = async (reportId) => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      await axios.patch(`http://localhost:3001/api/lost-found-pets/${reportId}/resolve`, {}, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      alert('Report marked as resolved!');
      fetchMyReports();
    } catch (error) {
      console.error('Error marking as resolved:', error);
      alert('Failed to mark as resolved. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your reports...</p>
      </div>
    );
  }

  return (
    <div className={styles.myReportsPage}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>My Pet Reports</h1>
          <p>Manage your lost and found pet reports</p>
        </div>
      </div>
      
      <div className={styles.container}>

        {reports.length === 0 ? (
          <div className={styles.emptyState}>
            <FaEye size={40} />
            <h3>No Reports Yet</h3>
            <p>You haven't reported any lost or found pets yet.</p>
          </div>
        ) : (
          <div className={styles.reportsGrid}>
            {reports.map((report, index) => (
              <motion.div 
                key={report._id} 
                className={`${styles.reportCard} ${styles[report.type]} ${report.status === 'resolved' ? styles.resolved : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {editingReport === report._id ? (
                  <div className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label>Pet Name</label>
                      <input
                        type="text"
                        value={editForm.petName}
                        onChange={(e) => setEditForm({...editForm, petName: e.target.value})}
                      />
                    </div>
                    
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Breed</label>
                        <input
                          type="text"
                          value={editForm.breed}
                          onChange={(e) => setEditForm({...editForm, breed: e.target.value})}
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label>Color</label>
                        <input
                          type="text"
                          value={editForm.color}
                          onChange={(e) => setEditForm({...editForm, color: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        rows="3"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      >
                        <option value="active">Active</option>
                        <option value="resolved">Resolved</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className={styles.editActions}>
                      <button 
                        className={styles.saveBtn}
                        onClick={() => handleUpdate(report._id)}
                      >
                        <FaCheck /> Save Changes
                      </button>
                      <button 
                        className={styles.cancelBtn}
                        onClick={() => setEditingReport(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.reportImage}>
                      <img src={`http://localhost:3001/${report.photo}`} alt={report.petName} />
                      <div className={`${styles.statusBadge} ${styles[report.type]}`}>
                        {report.type === 'lost' ? 'LOST' : 'FOUND'}
                      </div>
                      {report.status === 'resolved' && (
                        <div className={styles.resolvedBadge}>RESOLVED</div>
                      )}
                    </div>
                    
                    <div className={styles.reportInfo}>
                      <h3>{report.petName}</h3>
                      <p className={styles.petDetails}>
                        {report.breed} • {report.color} • {report.petType}
                      </p>
                      <p className={styles.description}>{report.description}</p>
                      
                      <div className={styles.locationInfo}>
                        <FaMapMarkerAlt />
                        <span>{report.location.address}</span>
                      </div>
                      
                      <div className={styles.reportMeta}>
                        <div className={styles.reportDate}>
                          Reported: {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                        <div className={`${styles.statusIndicator} ${styles[report.status]}`}>
                          {report.status.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className={styles.reportActions}>
                        <button 
                          className={styles.editBtn}
                          onClick={() => handleEdit(report)}
                          disabled={report.status === 'resolved'}
                        >
                          <FaEdit /> Edit
                        </button>
                        
                        {report.status !== 'resolved' && (
                          <button 
                            className={styles.resolveBtn}
                            onClick={() => handleMarkResolved(report._id)}
                          >
                            <FaCheck /> Mark Resolved
                          </button>
                        )}
                        
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(report._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
