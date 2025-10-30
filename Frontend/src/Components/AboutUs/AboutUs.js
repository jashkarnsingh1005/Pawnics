import React from 'react';
import { motion } from 'framer-motion';
import styles from './AboutUs.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { FaPaw, FaHandHoldingHeart, FaUsers, FaHistory, FaBullseye, FaLightbulb } from 'react-icons/fa';

const AboutUs = () => {
const teamMembers = [
  {
    id: 1,
    name: 'Pankil Budhiraja',
    role: 'Operations Manager', // ✅ changed from Founder & Director
    bio: 'Pankil ensures the smooth daily operations of Pawnics. He coordinates between different teams and makes sure that all processes run efficiently to support the well-being of the animals.',
    image: "/images/c.jpg"
  },
  {
    id: 2,
    name: 'Jashkaran Singh',
    role: 'Founder & Director',
    bio: 'Jashkaran founded Pawnics in 2018 with a vision to create a safe haven for abandoned pets. With over 15 years of experience in animal welfare, he leads our organization with passion and dedication.',
    image: '/images/a.jpg'
  },
  {
    id: 3,
    name: 'Jatin',
    role: 'Adoption Coordinator',
    bio: 'Jatin works tirelessly to match our animals with their perfect forever homes. His intuition and understanding of both human and animal needs has led to countless successful adoptions.',
    image: '/images/B.jpg'
  }
];

  return (
    <div className={styles.aboutPage}>
      <Navbar />
      
      <motion.section 
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroContent}>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Our Story
          </motion.h1>
          <motion.div 
            className={styles.headerAccent}
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ delay: 0.5, duration: 0.8 }}
          ></motion.div>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Dedicated to finding loving homes for pets in need since 2018
          </motion.p>
        </div>
      </motion.section>

      <section className={styles.missionSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.missionCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.missionIcon}>
              <FaHandHoldingHeart />
            </div>
            <h2>Our Mission</h2>
            <p>
              At Pawnics, our mission is to rescue, rehabilitate, and rehome abandoned and neglected animals, 
              while educating the community about responsible pet ownership. We believe every animal deserves 
              a loving home and proper care throughout their lives.
            </p>
          </motion.div>
        </div>
      </section>

      <section className={styles.historySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Journey</h2>
            <div className={styles.headerAccent}></div>
          </div>
          
          <div className={styles.timelineContainer}>
            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.timelineIcon}>
                <FaHistory />
              </div>
              <div className={styles.timelineContent}>
                <h3>2018 - The Beginning</h3>
                <p>
                  Pawnics was founded by Sarah Johnson after she rescued a litter of abandoned puppies. 
                  What started as a small foster network quickly grew as the need for animal rescue services 
                  in our community became apparent.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className={styles.timelineIcon}>
                <FaPaw />
              </div>
              <div className={styles.timelineContent}>
                <h3>2019 - First Shelter</h3>
                <p>
                  We opened our first physical shelter, allowing us to rescue more animals and provide 
                  better care. Our volunteer network expanded to over 50 dedicated animal lovers.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className={styles.timelineIcon}>
                <FaUsers />
              </div>
              <div className={styles.timelineContent}>
                <h3>2021 - Community Programs</h3>
                <p>
                  We launched our community education programs, including school visits, workshops on 
                  responsible pet ownership, and low-cost spay/neuter initiatives.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className={styles.timelineIcon}>
                <FaBullseye />
              </div>
              <div className={styles.timelineContent}>
                <h3>2023 - Expansion</h3>
                <p>
                  We expanded our facilities to include a dedicated veterinary clinic, rehabilitation 
                  center, and training area. This allowed us to provide comprehensive care for all animals 
                  in our shelter.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className={styles.timelineIcon}>
                <FaLightbulb />
              </div>
              <div className={styles.timelineContent}>
                <h3>2026 - Looking Forward</h3>
                <p>
                  Today, we continue to grow and evolve. Our focus is on sustainable rescue practices, 
                  innovative rehabilitation techniques, and creating lasting partnerships within our community.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Meet Our Team</h2>
            <div className={styles.headerAccent}></div>
            <p>The dedicated individuals who make our mission possible</p>
          </div>
          
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.id} 
                className={styles.teamCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <div className={styles.memberImage}>
                  <img src={`${member.image}?w=400&h=400&fit=crop&crop=faces`} alt={member.name} />
                </div>
                <div className={styles.memberInfo}>
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                  <p>{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Values</h2>
            <div className={styles.headerAccent}></div>
          </div>
          
          <div className={styles.valuesGrid}>
            <motion.div 
              className={styles.valueCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3>Compassion</h3>
              <p>We treat every animal with kindness and respect, recognizing their individual needs and personalities.</p>
            </motion.div>
            
            <motion.div 
              className={styles.valueCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h3>Integrity</h3>
              <p>We operate with transparency and honesty in all aspects of our work, building trust with our community.</p>
            </motion.div>
            
            <motion.div 
              className={styles.valueCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3>Education</h3>
              <p>We believe in empowering our community with knowledge about animal welfare and responsible pet ownership.</p>
            </motion.div>
            
            <motion.div 
              className={styles.valueCard}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3>Innovation</h3>
              <p>We continuously seek better ways to care for animals and serve our community through creative solutions.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;