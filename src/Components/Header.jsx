import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { LOGO_URL } from '../utils/constant';
import { getAuthUser, logout } from '../utils/authUtils';

const Header = () => {
  const navigate = useNavigate();
  const user = getAuthUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src={LOGO_URL} alt='MealTrails Logo' />
        <span className={styles.logoText}>MealTrails</span>
      </div>

      <div className={styles.navItems}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/cart">Cart</Link></li>

          {user ? (
            <>
              <li><Link to="/orders">My Orders</Link></li>
              <li className={styles.userGreeting}>👋 {user.name}</li>
              <li>
                <button className={styles.authBtn} onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;