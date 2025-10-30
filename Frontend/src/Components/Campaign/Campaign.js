import React from 'react';
import styles from './Campaign.module.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate

const Campaign = () => {
  const navigate = useNavigate(); // ✅ create navigate instance

  const campaigns = [
    {
      id: 1,
      title: "Vaccination Drive",
      description: "Help us vaccinate 100 stray animals this month to prevent disease and improve their quality of life.",
      goal: "$2,000",
      raised: "$1,250",
      progress: 62,
    },
    {
      id: 2,
      title: "Shelter Renovation",
      description: "We're upgrading our shelter facilities to provide better care and comfort for our rescued animals.",
      goal: "$5,000",
      raised: "$3,750",
      progress: 75,
    },
    {
      id: 3,
      title: "Winter Supplies",
      description: "Help us collect blankets, beds, and heating supplies to keep our animals warm during the cold months.",
      goal: "$1,500",
      raised: "$900",
      progress: 60,
    },
  ];

  return (
    <section className={styles.campaignSection}>
      <motion.div 
        className={styles.campaignContainer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>Current Campaigns</h2>
        <p>Join our efforts to make a difference in the lives of animals in need</p>
        
        <div className={styles.campaignGrid}>
          {campaigns.map((campaign, index) => (
            <motion.div 
              key={campaign.id} 
              className={styles.campaignCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <h3>{campaign.title}</h3>
              <p>{campaign.description}</p>
              
              <div className={styles.campaignStats}>
                <div className={styles.goalInfo}>
                  <span>Goal: {campaign.goal}</span>
                  <span>Raised: {campaign.raised}</span>
                </div>
                
                <div className={styles.progressBarContainer}>
                  <div 
                    className={styles.progressBar} 
                    style={{ width: `${campaign.progress}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>{campaign.progress}% Complete</span>
              </div>
              
              <motion.button 
                className={styles.donateBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  onClick={() => {
    navigate('/donation');
    window.scrollTo(0, 0);
  }}// ✅ navigate on click
              >
                Donate Now
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Campaign;
