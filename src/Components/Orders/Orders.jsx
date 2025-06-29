import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load orders from localStorage
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          // Sort orders by date (newest first)
          const sortedOrders = parsedOrders.sort((a, b) => 
            new Date(b.orderDate) - new Date(a.orderDate)
          );
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format estimated delivery time
  const formatDeliveryTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'preparing':
        return 'status-preparing';
      case 'out-for-delivery':
        return 'status-delivery';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-confirmed';
    }
  };

  // Handle order cancellation
  const handleCancelOrder = (orderId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (confirmCancel) {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  };

  // Handle reorder
  const handleReorder = (order) => {
    try {
      // Convert order items back to cart format
      const cartItems = order.items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Math.round(item.price * 100), // Convert back to cents
        defaultPrice: Math.round(item.price * 100),
        qty: 1, // Reset quantity to 1 for reorder
        restaurantName: item.restaurantName
      }));
      
      // Add to cart
      localStorage.setItem('cart', JSON.stringify(cartItems));
      alert('Items added to cart! 🛒');
      navigate('/cart');
    } catch (error) {
      console.error('Error reordering:', error);
      alert('Failed to add items to cart. Please try again.');
    }
  };

  // Show order details modal
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="no-orders">
          <div className="no-orders-icon">🍽️</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start exploring delicious restaurants!</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>Track and manage your food orders</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id.slice(-6)}</h3>
                <p className="order-date">{formatDate(order.orderDate)}</p>
              </div>
              <div className={`order-status ${getStatusClass(order.status)}`}>
                {order.status.replace('-', ' ').toUpperCase()}
              </div>
            </div>

            <div className="order-items">
              <div className="items-preview">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="item-preview">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="more-items">
                    +{order.items.length - 2} more items
                  </div>
                )}
              </div>
            </div>

            <div className="order-details">
              <div className="order-total">
                <span className="total-label">Total: </span>
                <span className="total-amount">₹{(order.total + 40 + (order.total * 0.05)).toFixed(2)}</span>
              </div>
              
              {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="delivery-time">
                  <span>Est. Delivery: {formatDeliveryTime(order.estimatedDelivery)}</span>
                </div>
              )}
            </div>

            <div className="order-actions">
              <button 
                className="btn-secondary"
                onClick={() => showOrderDetails(order)}
              >
                View Details
              </button>
              
              <button 
                className="btn-primary"
                onClick={() => handleReorder(order)}
              >
                Reorder
              </button>

              {(order.status === 'confirmed' || order.status === 'preparing') && (
                <button 
                  className="btn-danger"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={closeOrderDetails}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="order-summary">
                <div className="order-meta">
                  <p><strong>Order ID:</strong> #{selectedOrder.id.slice(-6)}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </p>
                  {selectedOrder.estimatedDelivery && (
                    <p><strong>Est. Delivery:</strong> {formatDeliveryTime(selectedOrder.estimatedDelivery)}</p>
                  )}
                </div>

                <div className="customer-info">
                  <h3>Delivery Details</h3>
                  <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                  <p><strong>Address:</strong> {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city} - {selectedOrder.customerInfo.pincode}</p>
                  <p><strong>Payment:</strong> {selectedOrder.customerInfo.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>

                <div className="ordered-items">
                  <h3>Items Ordered</h3>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="modal-item">
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>{item.description || "Delicious item"}</p>
                        {item.restaurantName && <p className="restaurant-name">From: {item.restaurantName}</p>}
                      </div>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                      <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="order-billing">
                  <div className="billing-row">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="billing-row">
                    <span>Delivery Fee:</span>
                    <span>₹40.00</span>
                  </div>
                  <div className="billing-row">
                    <span>Taxes (5%):</span>
                    <span>₹{(selectedOrder.total * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="billing-row total-row">
                    <span><strong>Total Amount:</strong></span>
                    <span><strong>₹{(selectedOrder.total + 40 + (selectedOrder.total * 0.05)).toFixed(2)}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeOrderDetails}>
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  handleReorder(selectedOrder);
                  closeOrderDetails();
                }}
              >
                Reorder Items
              </button>
              {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'preparing') && (
                <button 
                  className="btn-danger"
                  onClick={() => {
                    handleCancelOrder(selectedOrder.id);
                    closeOrderDetails();
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;