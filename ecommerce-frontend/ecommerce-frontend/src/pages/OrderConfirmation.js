import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function OrderConfirmation({ onClearCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const idFromState = location.state?.orderId;
    if (idFromState) {
      setOrderId(idFromState);
      localStorage.setItem('latestOrderId', idFromState);
    } else {
      const idFromStorage = localStorage.getItem('latestOrderId');
      setOrderId(idFromStorage);
    }
  }, [location.state]);

  return (
    <div
      style={{
        height: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        textAlign: 'center',
        padding: '1rem',
      }}
    >
      <div role="img" aria-label="Order Confirmed" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        ✅
      </div>

      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Thank you!</h1>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'normal', color: '#333' }}>
        Your order is confirmed.
      </h2>

      {orderId && (
        <p style={{ fontSize: '1rem', color: '#777', margin: '0.5rem 0 1.5rem' }}>
          Order ID: <strong>{orderId}</strong>
        </p>
      )}

      <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem' }}>
        Sit back and relax, your order is on the way!
      </p>

      <button
        onClick={() => {
          localStorage.removeItem('latestOrderId');
          if (onClearCart) {
            onClearCart();
          }
          navigate('/');
        }}
        style={{
          backgroundColor: '#00cc66',
          color: 'white',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Back Home
      </button>
    </div>
  );
}

export default OrderConfirmation;
