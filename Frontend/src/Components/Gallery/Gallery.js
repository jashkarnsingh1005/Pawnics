import React from 'react';
import styles from './Gallery.module.css';
import { motion } from 'framer-motion';

const Gallery = () => {
  // Sample pet images (in a real app, these would come from an API or database)
  const petImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
      alt: 'Cute dog',
      title: 'Max'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e',
      alt: 'Cat looking up',
      title: 'Whiskers'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
      alt: 'Golden retriever',
      title: 'Buddy'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac',
      alt: 'Cat on sofa',
      title: 'Mittens'
    },
    {
      id: 5,
      url: 'https://www.thesprucepets.com/thmb/wpN_ZunUaRQAc_WRdAQRxeTbyoc=/4231x2820/filters:fill(auto,1)/adorable-white-pomeranian-puppy-spitz-921029690-5c8be25d46e0fb000172effe.jpg',
      alt: 'Small puppy',
      title: 'Daisy'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5',
      alt: 'Tabby cat',
      title: 'Oliver'
    },
  ];

  return (
    <section className={styles.gallerySection}>
      <motion.div 
        className={styles.galleryContainer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>Our Adorable Friends</h2>
        <p>Meet some of the wonderful pets looking for their forever homes</p>
        
        <div className={styles.galleryGrid}>
          {petImages.map((image, index) => (
            <motion.div 
              key={image.id} 
              className={styles.galleryItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, zIndex: 1 }}
            >
              <img src={image.url} alt={image.alt} />
              <div className={styles.petInfo}>
                <h3>{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Gallery;