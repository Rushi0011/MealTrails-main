// src/Components/Contact.jsx

import React from 'react';
import styles from './Contact.module.css'; 

const Contact = () => {
  return (
    <div className={styles.contactContainer}>
      <h2>Contact Us</h2>
      <p>We’d love to hear from you! Fill out the form below and we’ll get back to you ASAP.</p>

      <form className={styles.contactForm}>
        <input
          type="text"
          placeholder="Your Name"
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className={styles.input}
          required
        />
        <textarea
          placeholder="Your Message"
          className={styles.textarea}
          required
        ></textarea>
        <button type="submit" className={styles.submitBtn}>Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
