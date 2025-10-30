import React from 'react';
import styles from './Footer.module.css';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Pawnics
            </motion.h3>
            <p>Giving every pet a second chance at happiness</p>
            <div className={styles.socialIcons}>
              <span className={styles.socialIcon}>FB</span>
              <span className={styles.socialIcon}>IG</span>
              <span className={styles.socialIcon}>TW</span>
            </div>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/adoption">Adoption Process</a></li>
              <li><a href="/volunteer">Volunteer</a></li>
              <li><a href="/donate">Donate</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
  <h4>Contact Us</h4>
  <p>Chitkara University, Rajpura, Punjab</p>
  <p>123 Pet Street, Animal City</p>
  <p>Phone: 9915326992</p>
  <p>Email:jashkaransaini10@gmail.com</p>
</div>

          
          <div className={styles.footerSection}>
            <h4>Newsletter</h4>
            <p>Subscribe to our newsletter for updates</p>
            <div className={styles.newsletterForm}>
              <input type="email" placeholder="Your email" />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Pawnics. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;