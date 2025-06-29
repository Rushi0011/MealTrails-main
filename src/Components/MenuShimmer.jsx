import React from 'react';
import styles from './MenuShimmer.module.css';

const MenuShimmer = ({ type = 'full', onRetry }) => {
  // Simple spinner for quick loading states
  if (type === 'spinner') {
    return (
      <div className={styles.menuLoadingSpinner}>
        <div className={styles.menuSpinner}></div>
        <p className={styles.menuLoadingText}>Loading menu...</p>
        <p className={styles.menuLoadingSubtext}>Please wait while we fetch the restaurant details</p>
      </div>
    );
  }

  // Error state with retry option
  if (type === 'error') {
    return (
      <div className={styles.menuError}>
        <div className={styles.menuErrorIcon}>😔</div>
        <h3 className={styles.menuErrorTitle}>Failed to load menu</h3>
        <p className={styles.menuErrorMessage}>
          We couldn't load the restaurant menu. Please check your connection and try again.
        </p>
        {onRetry && (
          <button className={styles.menuRetryButton} onClick={onRetry}>
            🔄 Try Again
          </button>
        )}
      </div>
    );
  }

  // Full menu shimmer with skeleton UI
  return (
    <div className={styles.menuShimmerContainer}>
      {/* Restaurant Info Shimmer */}
      <div className={styles.restaurantInfoShimmer}>
        <div className={styles.restaurantNameShimmer}></div>
        <div className={`${styles.restaurantDetailShimmer} ${styles.restaurantDetailMedium}`}></div>
        <div className={`${styles.restaurantDetailShimmer} ${styles.restaurantDetailShort}`}></div>
        <div className={`${styles.restaurantDetailShimmer} ${styles.restaurantDetailLong}`}></div>
      </div>

      {/* Menu Section Shimmer */}
      <div>
        <div className={styles.menuTitleShimmer}></div>
        
        {/* Menu Cards Shimmer */}
        <div className={styles.menuCardsShimmer}>
          {[...Array(8)].map((_, index) => (
            <div key={index} className={styles.menuCardShimmer}>
              <div className={styles.menuDetailsShimmer}>
                <div className={styles.menuItemNameShimmer}></div>
                <div className={styles.menuPriceShimmer}></div>
                <div className={`${styles.menuDescriptionShimmer} ${styles.menuDescriptionLine1}`}></div>
                <div className={`${styles.menuDescriptionShimmer} ${styles.menuDescriptionLine2}`}></div>
                <div className={`${styles.menuDescriptionShimmer} ${styles.menuDescriptionLine3}`}></div>
                <div className={styles.menuButtonShimmer}></div>
              </div>
              <div className={styles.menuImageShimmer}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuShimmer;