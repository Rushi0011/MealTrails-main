import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSummary.css';

const OrderSummary = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    let savedCart = localStorage.getItem('checkoutCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
      return;
    }
    savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      const convertedCart = cartData.map(item => ({
        ...item,
        quantity: item.qty || 1,
        price: (item.price || item.defaultPrice) / 100,
        restaurantName: item.restaurantName || "Restaurant"
      }));
      setCartItems(convertedCart);
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!orderForm.name.trim()) newErrors.name = 'Name is required';
    if (!orderForm.phone.trim()) newErrors.phone = 'Phone number is required';
    if (orderForm.phone && !/^\d{10}$/.test(orderForm.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!orderForm.email.trim()) newErrors.email = 'Email is required';
    if (orderForm.email && !/\S+@\S+\.\S+/.test(orderForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!orderForm.address.trim()) newErrors.address = 'Address is required';
    if (!orderForm.city.trim()) newErrors.city = 'City is required';
    if (!orderForm.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (orderForm.pincode && !/^\d{6}$/.test(orderForm.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const order = {
        id: Date.now().toString(),
        items: cartItems,
        customerInfo: orderForm,
        total: calculateTotal(),
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
      };
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      localStorage.removeItem('cart');
      localStorage.removeItem('checkoutCart');
      alert('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="order-summary-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to your cart first!</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  const subtotal = calculateTotal();
  const deliveryFee = 40;
  const taxes = subtotal * 0.05;
  const total = subtotal + deliveryFee + taxes;

  return (
    <div className="order-summary-container">
      <div className="order-summary-content">
        <h1>Order Summary</h1>
        <div className="order-sections">
          <div className="order-items-section">
            <h2>Your Order</h2>
            <div className="items-list">
              {cartItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="item-description">{item.description || "Delicious item"}</p>
                    <p className="item-restaurant">From: {item.restaurantName}</p>
                  </div>
                  <div className="item-quantity">
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <div className="item-price">
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <h3 className="summary-title">Price Breakdown</h3>
              <div className="total-row">
                <span>🧾 Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>🚚 Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>🧾 Taxes (5%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="total-row final-total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="delivery-details-section">
            <h2>Delivery Details</h2>
            <form onSubmit={handlePlaceOrder} className="order-form">
              <div className="form-content">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={orderForm.name} 
                      onChange={handleInputChange} 
                      className={errors.name ? 'error' : ''} 
                      placeholder="Enter your full name" 
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={orderForm.phone} 
                      onChange={handleInputChange} 
                      className={errors.phone ? 'error' : ''} 
                      placeholder="10-digit mobile number" 
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={orderForm.email} 
                    onChange={handleInputChange} 
                    className={errors.email ? 'error' : ''} 
                    placeholder="your.email@example.com" 
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Delivery Address *</label>
                  <textarea 
                    id="address" 
                    name="address" 
                    rows="3" 
                    value={orderForm.address} 
                    onChange={handleInputChange} 
                    className={errors.address ? 'error' : ''} 
                    placeholder="Enter your complete address with landmarks" 
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input 
                      type="text" 
                      id="city" 
                      name="city" 
                      value={orderForm.city} 
                      onChange={handleInputChange} 
                      className={errors.city ? 'error' : ''} 
                      placeholder="Your city" 
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="pincode">Pincode *</label>
                    <input 
                      type="text" 
                      id="pincode" 
                      name="pincode" 
                      value={orderForm.pincode} 
                      onChange={handleInputChange} 
                      className={errors.pincode ? 'error' : ''} 
                      placeholder="6-digit pincode" 
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <select 
                    id="paymentMethod" 
                    name="paymentMethod" 
                    value={orderForm.paymentMethod} 
                    onChange={handleInputChange}
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => navigate('/cart')}
                >
                  Back to Cart
                </button>
                <button 
                  type="submit" 
                  className="place-order-btn" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span> 
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;