import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './Donation.module.css';
import { 
  FaHeart, 
  FaSyringe, 
  FaUtensils, 
  FaStethoscope, 
  FaCalendarAlt,
  FaCreditCard,
  FaShieldAlt,
  FaHandHoldingHeart
} from 'react-icons/fa';

const Donation = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [progressData] = useState({
    raised: 250000,
    goal: 500000,
    percentage: 50
  });

  const predefinedAmounts = [500, 1000, 2500, 5000];

  const impactData = [
    {
      amount: 500,
      description: 'Vaccinations for 1 pet',
      icon: <FaSyringe />,
      color: '#4CAF50'
    },
    {
      amount: 1000,
      description: 'Food for 5 dogs for a week',
      icon: <FaUtensils />,
      color: '#FF9800'
    },
    {
      amount: 5000,
      description: 'Emergency surgery support',
      icon: <FaStethoscope />,
      color: '#F44336'
    }
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseInt(value) || 0);
    }
  };

  const handleDonation = () => {
    const amount = customAmount || selectedAmount;
    if (amount < 100) {
      alert('Minimum donation amount is ₹100');
      return;
    }

    // Simple demo payment simulation
    alert(`Thank you for your donation of ₹${amount.toLocaleString()}! This is a demo - in production, this would redirect to Razorpay payment gateway.`);
  };

  // Removed useEffect to prevent script loading errors

  return (
    <div className={styles.donationPage}>
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.heroContent}>
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Help Us Save More Pets – Every Contribution Matters!
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your donation directly impacts the lives of rescued pets, providing them with medical care, food, and shelter until they find their forever homes.
          </motion.p>
        </div>
        <div className={styles.heroAnimation}>
          <motion.div
            className={styles.floatingHeart}
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaHeart />
          </motion.div>
        </div>
      </motion.section>

      <div className={styles.contentContainer}>
        {/* Progress Tracker Section */}
        <motion.section 
          className={styles.progressSection}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className={styles.progressCard}>
            <h2>Current Campaign Progress</h2>
            <p>₹{progressData.raised.toLocaleString()} raised of ₹{progressData.goal.toLocaleString()} for medical supplies</p>
            
            <div className={styles.progressBarContainer}>
              <motion.div 
                className={styles.progressBar}
                initial={{ width: 0 }}
                animate={{ width: `${progressData.percentage}%` }}
                transition={{ delay: 0.5, duration: 1.5 }}
              />
            </div>
            
            <div className={styles.progressStats}>
              <span>{progressData.percentage}% Complete</span>
              <span>₹{(progressData.goal - progressData.raised).toLocaleString()} remaining</span>
            </div>
          </div>
        </motion.section>

        {/* Donation Form Section */}
        <motion.section 
          className={styles.donationFormSection}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className={styles.formCard}>
            <h2>Make a Donation</h2>
            
            {/* Donation Type Toggle */}
            <div className={styles.donationTypeToggle}>
              <button 
                className={`${styles.toggleButton} ${donationType === 'one-time' ? styles.active : ''}`}
                onClick={() => setDonationType('one-time')}
              >
                <FaCreditCard /> One-time
              </button>
              <button 
                className={`${styles.toggleButton} ${donationType === 'monthly' ? styles.active : ''}`}
                onClick={() => setDonationType('monthly')}
              >
                <FaCalendarAlt /> Monthly
              </button>
            </div>

            {/* Predefined Amounts */}
            <div className={styles.amountGrid}>
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`${styles.amountButton} ${selectedAmount === amount && !customAmount ? styles.selected : ''}`}
                  onClick={() => handleAmountSelect(amount)}
                >
                  ₹{amount.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className={styles.customAmountContainer}>
              <label>Custom Amount</label>
              <div className={styles.inputWrapper}>
                <span className={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className={styles.customAmountInput}
                  min="100"
                />
              </div>
            </div>

            {/* Donate Button */}
            <motion.button
              className={styles.donateButton}
              onClick={handleDonation}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaHandHoldingHeart />
              Donate ₹{(customAmount || selectedAmount).toLocaleString()} {donationType === 'monthly' ? '/month' : ''}
            </motion.button>

            <div className={styles.securityNote}>
              <FaShieldAlt />
              <span>Secure payment powered by Razorpay</span>
            </div>
          </div>
        </motion.section>

        {/* Impact Transparency Section */}
        <motion.section 
          className={styles.impactSection}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2>Your Impact</h2>
          <p>See how your donation directly helps our furry friends</p>
          
          <div className={styles.impactGrid}>
            {impactData.map((impact, index) => (
              <motion.div
                key={impact.amount}
                className={styles.impactCard}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div 
                  className={styles.impactIcon}
                  style={{ backgroundColor: impact.color }}
                >
                  {impact.icon}
                </div>
                <h3>₹{impact.amount.toLocaleString()}</h3>
                <p>{impact.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default Donation;
