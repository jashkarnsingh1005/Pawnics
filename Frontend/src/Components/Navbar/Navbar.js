import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Navbar.module.css';
import { motion } from 'framer-motion';
import { FaHome, FaInfoCircle, FaSignOutAlt, FaPaw, FaInbox, FaUserShield, FaSearch, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }
      
      try {
        const res = await axios.get("http://localhost:3001/api/auth/getUserDetails", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        setUser(res.data);
        setIsAdmin(res.data.email === 'admin@gmail.com' || res.data.role === 'admin');
        
        // Fetch unread message count
        fetchUnreadCount(accessToken);
      } catch (error) {
        console.error("Error fetching user details:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          try {
            const refreshRes = await axios.get(
              "http://localhost:3001/api/auth/refresh",
              { withCredentials: true }
            );
            localStorage.setItem("accessToken", refreshRes.data.accessToken);
            // Retry fetching user details
            const retryRes = await axios.get("http://localhost:3001/api/auth/getUserDetails", {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${refreshRes.data.accessToken}`,
              },
            });
            setUser(retryRes.data);
            setIsAdmin(retryRes.data.email === 'admin@gmail.com' || retryRes.data.role === 'admin');
            
            // Fetch unread message count
            fetchUnreadCount(refreshRes.data.accessToken);
          } catch (refreshError) {
            console.error("Session expired:", refreshError);
            localStorage.removeItem("accessToken");
            navigate("/login");
          }
        }
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const fetchUnreadCount = async (token) => {
    try {
      const response = await axios.get('http://localhost:3001/api/lost-found-messages/unread-count', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUnreadMessages(response.data.count || 0);
    } catch (error) {
      // Silently handle missing endpoint - set to 0
      setUnreadMessages(0);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <motion.nav 
      className={styles.navbar}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.navContainer}>
        <motion.div 
          className={styles.logo}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/">
            <h1>Pawnics</h1>
          </Link>
        </motion.div>
        
        <div className={styles.navLinks}>
          {/* Home Link - Always visible */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className={styles.navLink}>
              <FaHome className={styles.navIcon} />
              <span>Home</span>
            </Link>
          </motion.div>
          
          {/* About Us Link - Always visible */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/about" className={styles.navLink}>
              <FaInfoCircle className={styles.navIcon} />
              <span>About</span>
            </Link>
          </motion.div>
          
          {/* Adoption Link - Always visible */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/adoption" className={styles.navLink}>
              <FaPaw className={styles.navIcon} />
              <span>Adoption</span>
            </Link>
          </motion.div>

          {/* Events Link - Always visible */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/events" className={styles.navLink}>
              <FaInfoCircle className={styles.navIcon} />
              <span>Events</span>
            </Link>
          </motion.div>
          
          {/* Lost & Found Link - Always visible */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/lost-found" className={styles.navLink}>
              <FaSearch className={styles.navIcon} />
              <span>Lost & Found</span>
            </Link>
          </motion.div>
          
          {/* Donation Link - Always visible */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/donation" className={styles.navLink}>
              <FaHeart className={styles.navIcon} />
              <span>Donation</span>
            </Link>
          </motion.div>
          
          {/* Inbox Link - Always visible */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/inbox" className={styles.navLink}>
              Inbox
              {unreadMessages > 0 && (
                <span className={styles.notificationBadge}>{unreadMessages}</span>
              )}
            </Link>
          </motion.div>
          
          {/* Logout Button - Always visible */}
          <motion.button 
            className={styles.logoutBtn}
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt className={styles.btnIcon} />
            <span>Logout</span>
          </motion.button>
          
          {/* Dashboard Link - Only visible for admin, positioned at far right */}
          {isAdmin && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/dashboard" className={styles.dashboardBtn}>
                <FaUserShield className={styles.navIcon} />
                <span>Dashboard</span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;