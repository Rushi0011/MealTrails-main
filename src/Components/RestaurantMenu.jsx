import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./RestaurantMenu.module.css";
import MenuShimmer from "./MenuShimmer";
import { addToCart } from "../utils/cartUtils"; // Handles localStorage cart

const RestaurantMenu = () => {
  const { resId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurantMenu();
  }, [resId]);

  const fetchRestaurantMenu = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const realMenuUrl = `${import.meta.env.VITE_SWIGGY_API_BASE}/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${import.meta.env.VITE_DEFAULT_LAT}&lng=${import.meta.env.VITE_DEFAULT_LNG}&restaurantId=${resId}`;

const res = await fetch(
  `${import.meta.env.VITE_PROXY_BASE}?url=${encodeURIComponent(realMenuUrl)}`
);

      
      if (!res.ok) {
        throw new Error('Failed to fetch menu');
      }
      
      const data = await res.json();

      const restaurantInfo = data?.data?.cards?.find(
        (card) => card.card?.card?.info
      )?.card?.card?.info;

      if (!restaurantInfo) {
        throw new Error('Restaurant not found');
      }

      const menuData =
        data?.data?.cards
          ?.find((card) => card.groupedCard)
          ?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];

      const items = menuData
        .map((section) => section.card?.card?.itemCards || [])
        .flat()
        .map((item) => item.card?.info)
        .filter(Boolean)
        .slice(0, 15); // Show only 15 items

      if (items.length === 0) {
        throw new Error('No menu items found');
      }

      setRestaurant(restaurantInfo);
      setMenuItems(items);
    } catch (err) {
      console.error('Menu fetch error:', err);
      setError(err.message || "Failed to load menu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    setIsAddingToCart(prev => ({ ...prev, [item.id]: true }));
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      addToCart(item);
      
      // Show success feedback
      const button = document.getElementById(`btn-${item.id}`);
      if (button) {
        button.innerText = "✅ Added";
        button.disabled = true;
        setTimeout(() => {
          button.innerText = "➕ Add to Cart";
          button.disabled = false;
        }, 1500);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      // Handle error - maybe show a toast notification
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [item.id]: false }));
    }
  };

  // Show full shimmer on initial load
  if (isLoading) {
    return <MenuShimmer type="full" />;
  }

  // Show error state with retry option
  if (error) {
    return <MenuShimmer type="error" onRetry={fetchRestaurantMenu} />;
  }

  // Show spinner if no restaurant data (shouldn't happen with proper error handling)
  if (!restaurant) {
    return <MenuShimmer type="spinner" />;
  }

  return (
    <div className={styles.container}>
      {/* Restaurant Header */}
      <div className={styles.restaurantInfo}>
        <h2>{restaurant.name}</h2>
        <p>{restaurant.cuisines?.join(", ")}</p>
        <p>⭐ {restaurant.avgRating} · {restaurant.sla?.slaString}</p>
        <p>{restaurant.areaName}, {restaurant.city}</p>
      </div>

      {/* Menu Grid */}
      <div className={styles.menu}>
        <h3>🍽 Menu</h3>
        <div className={styles.grid}>
          {menuItems.map((item) => (
            <div key={item.id} className={styles.menuCard}>
              <div className={styles.menuDetails}>
                <h4>{item.name}</h4>
                <p className={styles.price}>
                  ₹{(item.price || item.defaultPrice) / 100}
                </p>
                <p className={styles.description}>
                  {item.description || "Delicious item from our kitchen"}
                </p>
                <button
                  id={`btn-${item.id}`}
                  className={styles.addBtn}
                  onClick={() => handleAddToCart(item)}
                  disabled={isAddingToCart[item.id]}
                >
                  {isAddingToCart[item.id] ? '⏳ Adding...' : '➕ Add to Cart'}
                </button>
              </div>
              {item.imageId && (
                <img
                  src={`https://media-assets.swiggy.com/swiggy/image/upload/w_150,h_120,c_fill/${item.imageId}`}
                  alt={item.name}
                  className={styles.menuImage}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;