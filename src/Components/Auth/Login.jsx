import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { findUser, setAuthUser } from "../../utils/authUtils";
import "./AuthForm.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle input blur for validation
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = findUser(form.email, form.password);
      if (user) {
        setAuthUser(user);
        setShowSuccess(true);
        
        // Short delay to show success message
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setErrors({ general: 'Invalid email or password. Please try again.' });
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-hide success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="auth-wrapper">
      <form className={`auth-form ${shake ? 'shake' : ''}`} onSubmit={handleLogin}>
        <h2>Welcome Back 👋</h2>
        <p>Sign in to continue to MealTrails</p>

        {showSuccess && (
          <div className="success-message">
            <span>✅</span>
            Login successful! Redirecting...
          </div>
        )}

        {errors.general && (
          <div className="error-message" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <span>❌</span>
            {errors.general}
          </div>
        )}

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={errors.email ? 'input-error' : ''}
            disabled={isLoading}
            autoComplete="email"
            required
          />
          {errors.email && (
            <div className="error-message">
              <span>⚠️</span>
              {errors.email}
            </div>
          )}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={errors.password ? 'input-error' : ''}
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
          {errors.password && (
            <div className="error-message">
              <span>⚠️</span>
              {errors.password}
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="button-loading">
              <div className="spinner"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;