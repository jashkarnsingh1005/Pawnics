import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaw, FaHeart, FaHome, FaUsers } from 'react-icons/fa';
import styles from './CountCard.module.css';

const CountCard = () => {
  const [counts, setCounts] = useState({
    rescued: 0,
    adopted: 0,
    volunteers: 0,
    donations: 0
  });

  const finalCounts = {
    rescued: 1247,
    adopted: 892,
    volunteers: 156,
    donations: 2340
  };

  const cardData = [
    {
      key: 'rescued',
      icon: FaPaw,
      label: 'Pets Rescued',
      color: '#FF6B6B',
      delay: 0
    },
    {
      key: 'adopted',
      icon: FaHome,
      label: 'Successful Adoptions',
      color: '#4ECDC4',
      delay: 0.2
    },
    {
      key: 'volunteers',
      icon: FaUsers,
      label: 'Active Volunteers',
      color: '#45B7D1',
      delay: 0.4
    },
    {
      key: 'donations',
      icon: FaHeart,
      label: 'Donations Received',
      color: '#96CEB4',
      delay: 0.6
    }
  ];

  useEffect(() => {
    const animateCount = (key, target, duration = 2000) => {
      const startTime = Date.now();
      const startValue = 0;
      
      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        setCounts(prev => ({
          ...prev,
          [key]: currentValue
        }));
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };
      
      requestAnimationFrame(updateCount);
    };

    // Start animations with delays
    cardData.forEach(({ key, delay }) => {
      setTimeout(() => {
        animateCount(key, finalCounts[key]);
      }, delay * 1000);
    });
  }, []);

  return (
    <motion.div 
      className={styles.countCardContainer}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2 
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Our Impact So Far
      </motion.h2>
      
      <div className={styles.cardsGrid}>
        {cardData.map(({ key, icon: Icon, label, color, delay }) => (
          <motion.div
            key={key}
            className={styles.card}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: delay + 0.3,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 10px 30px rgba(0,0,0,0.2)`
            }}
            style={{ '--card-color': color }}
          >
            <motion.div 
              className={styles.iconWrapper}
              initial={{ rotate: 0 }}
              whileInView={{ rotate: 360 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1, 
                delay: delay + 0.5,
                type: "spring",
                stiffness: 80
              }}
            >
              <Icon className={styles.icon} />
            </motion.div>
            
            <motion.div 
              className={styles.count}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: delay + 0.7,
                type: "spring",
                stiffness: 200
              }}
            >
              {counts[key].toLocaleString()}
            </motion.div>
            
            <motion.div 
              className={styles.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: delay + 0.9 }}
            >
              {label}
            </motion.div>
            
            <motion.div 
              className={styles.pulse}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: delay + 1
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CountCard;
