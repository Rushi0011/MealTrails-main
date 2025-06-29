import React, { useState } from "react";
import styles from "./About.module.css";

const About = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [teamVisible, setTeamVisible] = useState(false);

  const toggleSection = (sectionName) => {
    if (expandedSection === sectionName) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionName);
    }
  };

  const teamMembers = [
    { name: "Rushikesh Kamble", role: "Founder & CEO", bio: "Food enthusiast with 10+ years in the restaurant industry." },
    { name: "Marcus Chen", role: "Head of Operations", bio: "Logistics expert ensuring your food arrives hot and fresh." },
    { name: "Sophie Williams", role: "Customer Experience", bio: "Dedicated to making every order perfect." },
  ];

  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>About Us</h1>
      <p className={styles.aboutIntro}>
        Welcome to MealTrails – your favorite online food delivery partner!
      </p>

      <div className={styles.aboutSection}>
        <h2 
          className={styles.sectionHeader}
          onClick={() => toggleSection("who")}
        >
          Who We Are {expandedSection === "who" ? "▼" : "▶"}
        </h2>
        {expandedSection === "who" && (
          <div className={styles.sectionContent}>
            <p>
              At MealTrails, we are passionate about delivering your favorite meals
              from top restaurants directly to your doorstep. We partner with the
              best eateries in your city to ensure quality, speed, and taste!
            </p>
            <p>
              Founded in 2022, we've quickly grown to become the most loved food 
              delivery service with a commitment to excellence in every delivery.
            </p>
          </div>
        )}
      </div>

      <div className={styles.aboutSection}>
        <h2 
          className={styles.sectionHeader}
          onClick={() => toggleSection("mission")}
        >
          Our Mission {expandedSection === "mission" ? "▼" : "▶"}
        </h2>
        {expandedSection === "mission" && (
          <div className={styles.sectionContent}>
            <p>
              To make food ordering simple, fast, and satisfying. Whether you're
              craving comfort food or gourmet dishes, we're here to serve you
              anytime, anywhere.
            </p>
            <p>
              We believe good food should be accessible to everyone, which is why
              we're constantly expanding our restaurant partnerships and delivery zones.
            </p>
          </div>
        )}
      </div>

      <div className={styles.aboutSection}>
        <h2 
          className={styles.sectionHeader}
          onClick={() => toggleSection("why")}
        >
          Why Choose Us? {expandedSection === "why" ? "▼" : "▶"}
        </h2>
        {expandedSection === "why" && (
          <div className={styles.sectionContent}>
            <ul className={styles.benefitsList}>
              <li>🚀 Lightning-fast delivery</li>
              <li>🍽️ Wide variety of cuisines</li>
              <li>🛡️ Safe & hygienic packaging</li>
              <li>💸 Exclusive deals and offers</li>
              <li>⭐ Transparent ratings and reviews</li>
              <li>📱 Easy-to-use mobile app</li>
            </ul>
          </div>
        )}
      </div>

      <div className={styles.teamSection}>
        <button 
          className={styles.teamButton}
          onClick={() => setTeamVisible(!teamVisible)}
        >
          {teamVisible ? "Hide Our Team" : "Meet Our Team"}
        </button>
        
        {teamVisible && (
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamCard}>
                <h3>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.contactPrompt}>
        <p>Have questions about MealTrails?</p>
        <button className={styles.contactButton} onClick={() => window.location.href = '/contact'}>
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default About;