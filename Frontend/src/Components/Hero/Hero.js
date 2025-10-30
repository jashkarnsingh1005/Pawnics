import React from 'react';
import styles from './Hero.module.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      id: 1,
      text: "Pawnics helped me find my forever friend. Their dedication to animal welfare is unmatched!",
      author: "Sarah M.",
    },
    {
      id: 2,
      text: "The team at Pawnics goes above and beyond for every animal in their care. I'm grateful for their support.",
      author: "Michael T.",
    },
    {
      id: 3,
      text: "Thanks to Pawnics, I was able to provide a loving home to a rescue pet who has changed my life.",
      author: "Jessica L.",
    },
  ];

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <motion.div 
          className={styles.heroText}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1>Welcome to <span>Pawnics</span></h1>
          <p>Giving every pet a second chance at happiness</p>

          {/* Button navigates to /adoption */}
          <motion.button 
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/adoption')}
          >
            Adopt Today
          </motion.button>
        </motion.div>
        
        <motion.div 
          className={styles.testimonialContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <h2>What Our Community Says</h2>
          <div className={styles.testimonials}>
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id} 
                className={styles.testimonialCard}
                whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 * testimonial.id, duration: 0.5 }}
              >
                <p>"{testimonial.text}"</p>
                <span className={styles.author}>- {testimonial.author}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
