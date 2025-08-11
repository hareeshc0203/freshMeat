import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { fetchProducts } from './api';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import OrderConfirmation from './pages/OrderConfirmation';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegisterPage from './pages/RegisterPage';
import AboutUsPage from './pages/AboutUsPage';
import AddressPage from './pages/AddressPage';
import OrdersPage from './pages/OrdersPage';
import ForgotPasswordPage from './pages/ForgetPassword';

function AppRoutes({ products, cart, userInfo, setUserInfo, setCart }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserInfo(null);
    localStorage.removeItem("userInfo");
    setCart({});
    localStorage.removeItem("cart");
    navigate('/');
  };

  const handleAddToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: prev[id] ? prev[id] + 1 : 1 }));
  };

  const handleIncrement = (id) => {
    setCart(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id) => {
    setCart(prev => {
      const qty = prev[id] - 1;
      if (qty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: qty };
    });
  };

  const handleClearCart = () => {
    setCart({});
    localStorage.removeItem("cart");
  };

  return (
    <>
      <Navbar cart={cart} userInfo={userInfo} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={
          <HomePage
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            userInfo={userInfo}
            onClearCart={handleClearCart}
          />
        } />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/cart" element={
          <CartPage
            products={products}
            cart={cart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onClearCart={handleClearCart}
          />
        } />
        <Route path="/order-confirmation" element={<OrderConfirmation onClearCart={handleClearCart} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Forget-Password" element={<ForgotPasswordPage />} />
        <Route path="/Reset-password" element={<ResetPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : {};
  });

  const [userInfo, setUserInfo] = useState(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    fetchProducts()
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else if (Array.isArray(data.products)) setProducts(data.products);
        else console.error('Unexpected product format:', data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("userInfo");
      setUserInfo(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes
          products={products}
          cart={cart}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setCart={setCart}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
