import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveUser, setAuthUser } from "../../utils/authUtils";
import "./AuthForm.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '' });
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('at least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('lowercase letter');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('uppercase letter');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('number');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('special character');

    const strength = {
      0: { text: 'Very Weak', class: 'strength-weak' },
      1: { text: 'Weak', class: 'strength-weak' },
      2: { text: 'Fair', class: 'strength-fair' },
      3: { text: 'Good', class: 'strength-good' },
      4: { text: 'Strong', class: 'strength-strong' },
      5: { text: 'Very Strong', class: 'strength-strong' }
    };

    return {
      score,
      text: strength[score]?.text || 'Very Weak',
      class: strength[score]?.class || 'strength-weak',
      feedback: feedback.slice(0, 2) // Show max 2 suggestions
    };
  };

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
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
    
    // Update password strength for password field
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // Check if password is strong enough
    if (passwordStrength.score < 2) {
      setErrors({ password: 'Please choose a stronger password' });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Check if user already exists (basic simulation)
      const existingUser = JSON.parse(localStorage.getItem('users') || '[]')
        .find(user => user.email === form.email);
      
      if (existingUser) {
        setErrors({ email: 'An account with this email already exists' });
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      saveUser(form);
      setAuthUser(form);
      setShowSuccess(true);
      
      // Short delay to show success message
      setTimeout(() => {
        navigate("/");
      }, 1500);
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
      <form className={`auth-form ${shake ? 'shake' : ''}`} onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Join MealTrails and start your culinary journey!</p>

        {showSuccess && (
          <div className="success-message">
            <span>🎉</span>
            Account created successfully! Welcome aboard!
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
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={errors.name ? 'input-error' : ''}
            disabled={isLoading}
            autoComplete="name"
            required
          />
          {errors.name && (
            <div className="error-message">
              <span>⚠️</span>
              {errors.name}
            </div>
          )}
        </div>

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
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={errors.password ? 'input-error' : ''}
            disabled={isLoading}
            autoComplete="new-password"
            required
          />
          {errors.password && (
            <div className="error-message">
              <span>⚠️</span>
              {errors.password}
            </div>
          )}
          
          {form.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div className={`strength-fill ${passwordStrength.class}`}></div>
              </div>
              <div className="strength-text">
                Password strength: <strong>{passwordStrength.text}</strong>
                {passwordStrength.feedback.length > 0 && (
                  <span> • Add {passwordStrength.feedback.join(', ')}</span>
                )}
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="button-loading">
              <div className="spinner"></div>
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;