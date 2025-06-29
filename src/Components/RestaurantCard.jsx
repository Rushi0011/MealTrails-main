import React from "react";
import styles from "./RestaurantCard.module.css"; // or adjust path if inside Body.module.css

const RestaurantCard = ({ resData }) => {
  const { name, cloudinaryImageId, cuisines, avgRating, costForTwo, sla } = resData.info;

  return (
    <div className={styles.restaurantCard}>
      <img
        className={styles.restaurantImage}
        src={`https://media-assets.swiggy.com/swiggy/image/upload/w_500,h_300,c_fill/${cloudinaryImageId}`}
        alt={name}
      />
      <div className={styles.restaurantContent}>
        <h3 className={styles.restaurantName}>{name}</h3>
        <p className={styles.restaurantCuisines}>{cuisines.join(", ")}</p>
        <p className={styles.restaurantInfo}>
          ⭐ {avgRating} • {costForTwo} • {sla?.deliveryTime} min
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
