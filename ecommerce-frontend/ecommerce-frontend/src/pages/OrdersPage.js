import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("You must be logged in to view orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
        } else {
          setError(data.msg || "Failed to fetch orders.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: theme.colors.text,
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '1rem',
          backgroundColor: theme.colors.primary,
          color: '#fff',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        ← Back to Home
      </button>

      <h2 style={{ color: theme.colors.secondary, marginBottom: '1.5rem' }}>Your Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map((order) => (
            <li
              key={order._id}
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '10px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <p>
                <strong>Order ID:</strong>{' '}
                {order._id.startsWith("FM")
                  ? order._id
                  : `FM${order.timestamp.replace(/[-T:.Z]/g, '').slice(0, 17)}`}
              </p>
              <p><strong>Total:</strong> ₹{order.total_amount}</p>
              <p><strong>Time:</strong> {new Date(order.timestamp).toLocaleString()}</p>

              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.title} x {item.quantity} — ₹{item.price * item.quantity}
                    {item.weight && item.weight !== 'N/A' && (
                      <span style={{ color: 'gray', fontSize: '0.9rem' }}>
                        {' '}({item.weight})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersPage;
