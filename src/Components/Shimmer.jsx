import React from 'react';
import styles from './Shimmer.module.css';

const Shimmer = ({ type = 'full' }) => {
  // Simple spinner for quick loading states
  if (type === 'spinner') {
    return (
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading restaurants...</p>
      </div>
    );
  }

  // Full page shimmer with skeleton UI
  return (
    <div className={styles.body}>
      {/* Hero Section Shimmer */}
      <div className={styles.heroShimmer}>
        <div className={styles.heroShimmerContent}>
          <div className={styles.heroTitleShimmer}></div>
          <div className={styles.heroSubtitleShimmer}></div>
          <div className={styles.searchShimmer}></div>
        </div>
      </div>

      {/* Cuisine Circles Shimmer */}
      <div className={styles.cuisineShimmer}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className={styles.cuisineCircleShimmer}></div>
        ))}
      </div>

      {/* Restaurant Cards Shimmer */}
      <div className={styles.shimmerContainer}>
        {[...Array(10)].map((_, index) => (
          <div key={index} className={styles.shimmerCards}>
            <div className={styles.shimmerImagePlaceholder}></div>
            <div className={`${styles.shimmerTextPlaceholder} ${styles.shimmerTextLong}`}></div>
            <div className={`${styles.shimmerTextPlaceholder} ${styles.shimmerTextMedium}`}></div>
            <div className={`${styles.shimmerTextPlaceholder} ${styles.shimmerTextShort}`}></div>
            <div className={`${styles.shimmerTextPlaceholder} ${styles.shimmerTextMedium}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shimmer;