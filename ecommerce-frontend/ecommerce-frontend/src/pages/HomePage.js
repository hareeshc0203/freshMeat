import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';
import video from '../assets/video.mp4';
import ProductCard from '../components/ProductCard';


function HomePage({ products = [], cart = {}, onAddToCart, onIncrement, onDecrement , onClearCart }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  let userInfo;
    try {
      userInfo = JSON.parse(localStorage.getItem("userInfo"));
    } catch (e) {
      userInfo = null;
    }

  const userFirstName = userInfo?.firstname;
  const isLoggedIn = !!userFirstName;

  const sidebarRef = useRef(null);

    useEffect(() => {
  document.body.contentEditable = 'false';
  const root = document.getElementById('root');
  if (root) root.contentEditable = 'false';
}, []);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const handleSidebarLinkClick = (callback) => {
    setIsSidebarOpen(false);
    callback();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    onClearCart(); // 💥 Clear cart here
    window.dispatchEvent(new Event("storage")); // trigger global update
    navigate('/');
  };

  const cartItemCount = useMemo(() => Object.values(cart).reduce((sum, qty) => sum + qty, 0), [cart]);
  const cartTotal = useMemo(() =>
    products
      .filter(p => cart[p.id])
      .reduce((total, p) => total + p.price * cart[p.id], 0)
      .toFixed(2),
    [cart, products]
  );

  return (
    <>
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '1rem',
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          minHeight: '100vh',
        }}
      >
        {/* Sidebar */}
        {isSidebarOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '70%',
              height: '100%',
              zIndex: 999,
              display: 'flex',
            }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              ref={sidebarRef}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: isMobile ? '80%' : '50%',
                height: '100%',
                backgroundColor: '#fff',
                boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              {/* Menu Heading */}
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Menu</span>

              {isLoggedIn ? (
                <>
                  {/* Greeting */}
                  <span style={{ fontWeight: '500', color: theme.colors.secondary }}>
                    Hi, {userFirstName}
                  </span>

                  {/* Orders Link */}
                  <span
                    onClick={() => handleSidebarLinkClick(() => navigate('/orders'))}
                    style={{ cursor: 'pointer', fontWeight: '500' }}
                  >
                    Your Orders
                  </span>
                </>
              ) : (
                <>
                  {/* Login/Register Link */}
                  <span
                    onClick={() => handleSidebarLinkClick(() => navigate('/login'))}
                    style={{
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: theme.colors.primary,
                    }}
                  >
                    Login/Register
                  </span>
                </>


              )}

              {/* Common Links */}
              <span onClick={() => handleSidebarLinkClick(() => navigate('/'))}>Home</span>
              <span
                onClick={() =>
                  handleSidebarLinkClick(() => window.scrollTo({ top: 600, behavior: 'smooth' }))
                }
              >
                Our Products
              </span>
              <span onClick={() => handleSidebarLinkClick(() => navigate('/about'))}>About Us</span>

              {/* Logout shown only if logged in */}
              {isLoggedIn && (
                <span
                  onClick={handleLogout}
                  style={{
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: theme.colors.primary,
                  }}
                >
                  Logout
                </span>
              )}
            </div>
          </div>
        )}

        {/* Top Navbar */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: `1px solid ${theme.colors.border}`, paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <FaBars size={25} />
            </button>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 'bold', color: theme.colors.primary, cursor: 'pointer' }} onClick={() => navigate('/')}>
              FreshMeat
            </div>
          </div>
          <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isLoggedIn ? (
              
                <span>Hi, {userFirstName}</span>
  
            ) : (
              <span onClick={() => navigate('/login')}>Login/Register</span>
            )}
          </div>
        </nav>

        {/* Video Banner */}
        <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: isMobile ? '35%' : '30%', borderRadius: '8px', overflow: 'hidden', border: `2px solid ${theme.colors.border}` }}>
            <video style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} autoPlay loop muted playsInline>
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-70%, -10%)', color: '#fff', padding: isMobile ? '0.5rem 1rem' : '1rem 2rem', borderRadius: '12px', fontSize: isMobile ? '1rem' : '1.5rem', fontWeight: 'bold', fontFamily: "'Poppins', sans-serif", textShadow: '1px 1px 3px rgba(8, 19, 15, 0.8)', textAlign: 'center', maxWidth: '90%', lineHeight: 1.4 }}>
              <div style={{ whiteSpace: 'nowrap' }}>Fresh, Clean, Hand-Cut Mutton</div>
              <div>Delivered to Your Doorstep</div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section>
          <h2 style={{ marginBottom: '1rem', color: theme.colors.secondary }}>Our Products</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {products.map((product) => {
              const {
                id,
                title,
                description,
                price,
                image,
                weight,
                pieces,
                oldPrice,
              } = product;

              const discount =
                oldPrice && oldPrice > price
                  ? Math.round(((oldPrice - price) / oldPrice) * 100)
                  : null;
                  const quantity = cart[id] || 0;
              return (
                <ProductCard
                  key={id}
                  image={image}
                  title={title}
                  description={description}
                  weight={weight}
                  pieces={pieces}
                  price={price}
                  oldPrice={oldPrice}
                  discount={discount}
                  quantity={quantity}
                  onAddToCart={() => onAddToCart(id)}
                  onIncrement={() => onIncrement(id)}
                  onDecrement={() => onDecrement(id)}
                />
              );
            })}
          </div>
        </section>

        {/* Floating Cart Summary */}
        {cartItemCount > 0 && (
          <section style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '850px', backgroundColor: '#000', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', zIndex: 1000, }} 
          onClick={() => {
            if (isLoggedIn) {
              navigate('/cart');
            } else {
              navigate('/login');
            }
          }}
          >
            <div style={{ fontSize: '0.95rem' }}>
              🛒 {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} | ₹{cartTotal}
            </div>
            <div style={{ marginLeft: '1rem', fontWeight: 'bold' }}>View Cart →</div>
          </section>
        )}

        {/* Footer */}
        <section style={{ backgroundColor: '#555555', color: '#fff', textAlign: 'center', padding: '1rem 1rem', marginTop: '1rem', borderRadius: '12px', fontSize: '0.7rem', lineHeight: '1.5', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          <p style={{ marginBottom: '0.9rem', fontWeight: '400' }}>
            © 2025 FreshMeat Pvt Ltd. All Rights Reserved.
          </p>
          <p>
            FreshMeat is your one-stop fresh meat delivery shop. In here, you get the freshest meat delivered straight to your doorstep in our Dharmavram.
          </p>
        </section>
      </div>
    </>
  );
}

export default HomePage;
