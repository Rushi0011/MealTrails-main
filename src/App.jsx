import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

import Header from './Components/Header';
import Body from './Components/Body';
import About from './Components/About';
import Contact from './Components/Contact';
import Cart from './Components/Cart';
import RestaurantMenu from './Components/RestaurantMenu';

// ✅ Auth components
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import ProtectedRoute from './Components/Auth/ProtectedRoute';

// ✅ Order components
import OrderSummary from './Components/Orders/OrderSummary';
import Orders from './Components/Orders/Orders';

const AppLayout = () => (
  <div className="App">
    <Header />
    <Outlet />
  </div>
);

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <Body /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },

      // ✅ Auth routes
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      // ✅ Protected route for Cart
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },

      // ✅ Protected route for Order Summary/Checkout
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <OrderSummary />
          </ProtectedRoute>
        ),
      },

      // ✅ Alternative route for order-summary (backward compatibility)
      {
        path: 'order-summary',
        element: (
          <ProtectedRoute>
            <OrderSummary />
          </ProtectedRoute>
        ),
      },

      // ✅ Public Restaurant Menu Page
      {
        path: 'restaurant/:resId',
        element: <RestaurantMenu />,
      },

      // ✅ Protected Orders History Page
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },

      // ✅ Protected My Orders (alternative route)
      {
        path: 'my-orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default appRouter;