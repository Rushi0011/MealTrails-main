import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  saveCart,
  removeFromCart,
  updateCartItem,
} from "../utils/cartUtils";
import styles from "./Cart.module.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleQtyChange = (id, type) => {
    updateCartItem(id, type);
    setCartItems(getCart());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCartItems(getCart());
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    // Convert cart items to the format expected by OrderSummary
    const checkoutItems = cartItems.map(item => ({
      ...item,
      quantity: item.qty, // Convert qty to quantity
      price: (item.price || item.defaultPrice) / 100, // Convert to rupees
      restaurantName: item.restaurantName || "Restaurant" // Add restaurant name if missing
    }));
    
    // Save to localStorage for OrderSummary to read
    localStorage.setItem('checkoutCart', JSON.stringify(checkoutItems));
    
    navigate('/checkout');
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || item.defaultPrice) * item.qty,
    0
  ) / 100;

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p className={styles.empty}>Your cart is empty.</p>
          <button 
            className={styles.browseBtn}
            onClick={() => navigate('/')}
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.itemDetails}>
                  <h4 className={styles.itemName}>{item.name}</h4>
                  <p className={styles.itemDescription}>
                    {item.description || "Delicious item"}
                  </p>
                  <p className={styles.itemPrice}>
                    ₹{(item.price || item.defaultPrice) / 100}
                  </p>
                  <div className={styles.controls}>
                    <button
                      className={styles.controlBtn}
                      onClick={() => handleQtyChange(item.id, "decrement")}
                      disabled={item.qty <= 1}
                    >
                      ➖
                    </button>
                    <span className={styles.qty}>{item.qty}</span>
                    <button
                      className={styles.controlBtn}
                      onClick={() => handleQtyChange(item.id, "increment")}
                    >
                      ➕
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemove(item.id)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.totalSection}>
            <div className={styles.totalBreakdown}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Delivery Fee:</span>
                <span>₹40.00</span>
              </div>
              <div className={styles.totalRow}>
                <span>Taxes (5%):</span>
                <span>₹{(total * 0.05).toFixed(2)}</span>
              </div>
              <div className={styles.finalTotal}>
                <strong>Total: ₹{(total + 40 + (total * 0.05)).toFixed(2)}</strong>
              </div>
            </div>
            <button 
              className={styles.checkoutBtn}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;