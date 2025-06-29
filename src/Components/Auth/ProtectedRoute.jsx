import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../../utils/authUtils";
import "./ProtectedRoute.css";

const LoadingSpinner = () => (
  <div className="loading-wrapper">
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Checking authentication...</p>
      <p className="loading-subtext">Please wait a moment</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulate a brief auth check delay for better UX
    const checkAuth = async () => {
      // Small delay to prevent flash
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const authStatus = isLoggedIn();
      setAuthenticated(authStatus);
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to login with the attempted location
  if (!authenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;