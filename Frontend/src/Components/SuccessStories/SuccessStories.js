import React, { useState } from 'react';
import styles from './SuccessStories.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaw, FaHeart, FaQuoteLeft, FaTimes } from 'react-icons/fa';

const SuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState(null);

  const stories = [
  {
    id: 1,
    title: "Luna's Journey Home",
    content: "After being rescued from a difficult situation, Luna found her forever family who gave her the love and care she deserved.",
    image: "https://tse1.mm.bing.net/th/id/OIP.Gh8QtnFEh8LOj1a6-Q88FQHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    icon: <FaPaw />,
    date: "June 12, 2023",
    fullContent: "Luna was found abandoned and scared, unsure of where to turn for safety. Compassionate volunteers stepped in to rescue her, providing immediate medical care and gentle affection. The rescue team treated Luna’s wounds and offered the attention she desperately needed. Within weeks, Luna recovered physically and emotionally, regaining her playful spirit. She was soon adopted by a loving family who gave her endless cuddles, playtime, and long walks. Today, Luna thrives in her new home, bringing happiness and warmth everywhere she goes."
  },
  {
    id: 2,
    title: "Rocky's Second Chance",
    content: "Rocky was found abandoned and injured. Thanks to our medical team and volunteers, he made a full recovery.",
    image: "https://images.unsplash.com/photo-1551730459-92db2a308d6a",
    icon: <FaHeart />,
    date: "August 3, 2023",
    fullContent: "Rocky’s rescue was a challenge from the start, as he was found abandoned, injured, malnourished, and suffering from a broken leg. The medical team worked tirelessly to treat his injuries and restore his health. Volunteers gave Rocky the love, patience, and encouragement he needed to heal. After weeks of dedicated care, Rocky made a full recovery—his strength returned and his spirit revived. He was adopted by a family that adores him and takes him on daily adventures. Rocky now enjoys a joyful life filled with trust and affection."
  },
  {
    id: 3,
    title: "Bella's Transformation",
    content: "When Bella arrived, she was shy and fearful. With patience and training, she blossomed into a confident, happy dog.",
    image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01",
    icon: <FaPaw />,
    date: "October 15, 2023",
    fullContent: "Bella arrived at the shelter fearful and withdrawn, often hiding and avoiding interaction. With gentle patience and positive training methods, the rescue team built Bella’s confidence. She gradually warmed up, learning to trust her caregivers and responding well to positive reinforcement. Over time, Bella transformed into an energetic and friendly dog, enjoying playtime and companionship. Her new family describes Bella as the sunshine of their home, always bringing happiness with her playful spirit."
  },
  {
    id: 4,
    title: "Max's New Beginning",
    content: "Max was surrendered when his family could no longer care for him. He found a loving home within two weeks.",
    image: "https://tse3.mm.bing.net/th/id/OIP.X2MUtzcOTwJUFLTJ4_PMdAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    icon: <FaHeart />,
    date: "January 8, 2024",
    fullContent: "Max was surrendered to the shelter because his family could no longer care for him due to financial hardship. Initially, Max was confused and withdrawn, struggling to adjust to his new environment. Shelter volunteers provided comfort and reassurance, helping Max feel safe again. Within two weeks, a retired couple visited and instantly bonded with Max, adopting him into their peaceful, loving home. Max now enjoys tranquil days filled with outdoor walks and constant affection, symbolizing the hope of new beginnings."
  },
  {
    id: 5,
    title: "Daisy's Recovery Story",
    content: "Daisy was found severely malnourished. Our veterinary team worked tirelessly to nurse her back to health.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
    icon: <FaPaw />,
    date: "March 22, 2024",
    fullContent: "Daisy’s situation was dire when she was found—severely malnourished and too weak to stand. The veterinary team stepped in to provide round-the-clock care, special diets, and medical support. Over time, Daisy regained her strength, health, and enthusiasm for life. When she was ready for adoption, Daisy was welcomed into a caring family that showers her with unconditional love. Her recovery serves as testimony to the dedication of her rescuers and the transformative power of compassion."
  },
  {
    id: 6,
    title: "Charlie's Forever Family",
    content: "Charlie spent over a year in our shelter before finding his perfect match.",
    image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48",
    icon: <FaHeart />,
    date: "May 5, 2024",
    fullContent: "Charlie spent over a year in the shelter, patiently waiting for someone to recognize his gentle soul. Many families overlooked him, but Charlie remained hopeful and kind. Eventually, a loving family visited the shelter and formed an instant bond with Charlie, choosing to adopt him at last. Charlie’s new life is full of laughter, playtime, and joy—his patience paid off in the form of a forever family that cherishes him deeply."
  }
];


  return (
    <section className={styles.storiesSection}>
      <motion.div 
        className={styles.storiesContainer}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Success Stories</h2>
          <div className={styles.headerAccent}></div>
          <p>Every adoption is a story of hope and new beginnings</p>
        </motion.div>

        {/* Stories Grid */}
        <div className={styles.storiesGrid}>
          {stories.map((story, index) => (
            <motion.div 
              key={story.id} 
              className={styles.storyCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}
            >
              <div className={styles.cardBadge}>{story.icon}</div>
              <div className={styles.storyImage}>
                <img src={story.image} alt={story.title} />
                <div className={styles.imageOverlay}></div>
              </div>
              <div className={styles.storyContent}>
                <div className={styles.quoteIcon}><FaQuoteLeft /></div>
                <h3>{story.title}</h3>
                <p>{story.content}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.storyDate}>{story.date}</span>
                  <motion.button 
                    className={styles.readMoreBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStory(story)}
                  >
                    Read Full Story
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button 
                className={styles.closeBtn} 
                onClick={() => setSelectedStory(null)}
              >
                <FaTimes />
              </button>
              <img src={selectedStory.image} alt={selectedStory.title} />
              <h2>{selectedStory.title}</h2>
              <p><strong>Date:</strong> {selectedStory.date}</p>
              <p>{selectedStory.fullContent}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SuccessStories;
