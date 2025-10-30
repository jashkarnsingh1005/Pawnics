import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import styles from './HomePage.module.css';
import Navbar from '../Navbar/Navbar';
import Hero from '../Hero/Hero';
import Gallery from '../Gallery/Gallery';
import SuccessStories from '../SuccessStories/SuccessStories';
import Campaign from '../Campaign/Campaign';
import Footer from '../Footer/Footer';
import { FaPaw } from 'react-icons/fa';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUserDetails = async (token) => {
    return await axios.get("http://localhost:3001/api/auth/getUserDetails", {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    // Fetch user details from backend
    const fetchUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetchUserDetails(accessToken);
        setUser(res.data);
      } catch (error) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          try {
            console.log("Access Token Expired");
            const refreshRes = await axios.get(
              "http://localhost:3001/api/auth/refresh",
              {
                withCredentials: true,
              }
            );
            const newAccessToken = refreshRes.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            const retryRes = await fetchUserDetails(newAccessToken);
            setUser(retryRes.data);
          } catch (refresherror) {
            console.log("Refresh token expired");
            localStorage.clear();
            navigate("/login");
          }
        }
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return (
    <motion.div 
      className={styles.loading}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className={styles.spinner}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      ></motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Loading Pawnics...
      </motion.p>
    </motion.div>
  );

  return (
    <motion.div 
      className={styles.homePage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main>
        <Hero />
        
        
        <motion.div 
          className={styles.sectionWrapper}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Gallery />
        </motion.div>
        
        <motion.div 
          className={styles.decorativeElement}
          style={{ 
            position: 'absolute', 
            left: '5%', 
            top: '40%', 
            color: 'var(--primary-color)',
            opacity: 0.1,
            fontSize: '8rem',
            zIndex: 0
          }}
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.05, 1, 0.95, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <FaPaw />
        </motion.div>
        
        <SuccessStories />
        
        <motion.div 
          className={styles.sectionWrapper}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Campaign />
        </motion.div>
        
        <motion.div 
          className={styles.decorativeElement}
          style={{ 
            position: 'absolute', 
            right: '5%', 
            bottom: '20%', 
            color: 'var(--primary-color)',
            opacity: 0.1,
            fontSize: '8rem',
            zIndex: 0,
            transform: 'rotate(45deg)'
          }}
          animate={{ 
            rotate: [45, 55, 45, 35, 45],
            scale: [1, 1.05, 1, 0.95, 1]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <FaPaw />
        </motion.div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default HomePage;