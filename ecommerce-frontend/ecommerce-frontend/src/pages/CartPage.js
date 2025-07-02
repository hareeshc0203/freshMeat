// ...other imports
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from '../theme';

const API_BASE_URL = 'http://localhost:5000';

function CartPage({ cart, products, onIncrement, onDecrement }) {
  const navigate = useNavigate();
  const cartItems = useMemo(() => products.filter(p => cart[p.id]), [products, cart]);

  const [addresses, setAddresses] = useState([]);
  const isBrowser = typeof window !== 'undefined';
  const [selectedAddressId, setSelectedAddressId] = useState(
    isBrowser ? localStorage.getItem('selectedAddressId') || '' : ''
  );
  const [addressError, setAddressError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [newAddress, setNewAddress] = useState({
    houseNo: '',
    landmark: '',
    town: 'Dharamavaram 515671',
    state: 'Andhra Pradesh',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  const fetchAddresses = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/get-addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses);
        if (!selectedAddressId && data.addresses.length > 0) {
          setSelectedAddressId(data.addresses[0]._id);
        }
      } else {
        console.error(data.msg || 'Failed to fetch addresses.');
      }
    } catch (err) {
      console.error('Fetch address error:', err);
    }
  }, [selectedAddressId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('selectedAddressId', selectedAddressId || '');
    }
  }, [selectedAddressId, isBrowser]);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0),
    [cartItems, cart]
  );

  const isValidSelectedAddress = addresses.some(addr => addr._id === selectedAddressId);

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem('token');
    if (!selectedAddressId) {
      setAddressError('Please select a delivery address.');
      return;
    }

    const orderItems = cartItems.map(item => ({
      title: item.title,
      quantity: cart[item.id],
      weight: item.weight || "N/A", 
      price: item.price,
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: orderItems, totalAmount, addressId: selectedAddressId }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error('Order failed: ' + (data.msg || 'Unknown error'));
        return;
      }

      toast.success('Order placed successfully!');
      localStorage.setItem('latestOrderId', data.order_id);
      navigate('/order-confirmation', { state: { orderId: data.order_id } });

    } catch (error) {
      console.error('Order error:', error);
      toast.error('An error occurred while placing the order.');
    }
  };

  const handleAddAddress = async () => {
    const token = localStorage.getItem('token');
    const trimmed = {
      houseNo: newAddress.houseNo.trim(),
      landmark: newAddress.landmark.trim(),
      town: newAddress.town,
      state: newAddress.state,
    };

    const { houseNo, landmark, town, state } = trimmed;

    if (!houseNo || !landmark || !town || !state) {
      toast.error('Please fill all address fields.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/add-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trimmed),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.msg || 'Failed to save address');
        return;
      }

      const newId = data.address?._id || data.addressId;
      if (newId) setSelectedAddressId(newId);

      setShowModal(false);
      setNewAddress({
        houseNo: '',
        landmark: '',
        town: 'Dharamavaram, 515671',
        state: 'Andhra Pradesh',
      });
      await fetchAddresses();

      toast.success('Address saved successfully!');
    } catch (err) {
      console.error('Add address error:', err);
      toast.error('Error saving address.');
    }
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: 'crimson',
    fontSize: '1.2rem',
    cursor: 'pointer',
    lineHeight: '1',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    userSelect: 'none',
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ marginBottom: '1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <span style={{ fontSize: '1.1rem', color: theme.colors.primary }}>← Back to Home</span>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeeba',
        padding: '1rem',
        borderRadius: '6px',
        marginBottom: '1.5rem',
        fontSize: '0.95rem'
      }}>
        📍 <strong>Note:</strong> We currently accept orders only for <strong>Dharamavaram</strong> location. Please ensure your address is within this area before placing the order.
      </div>

      <h1 style={{ color: theme.colors.primary, marginBottom: '1.5rem' }}>Your Cart</h1>

      {cartItems.map(item => (
        <div key={item.id} style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: '1rem',
        }}>
          <img src={item.image} alt={item.title} style={{
            width: '120px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginRight: '1rem'
          }} />
          <div style={{ flex: 1 }}>
            <h3>{item.title}</h3>
            <p>Price: ₹{item.price}</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button style={buttonStyle} onClick={() => onDecrement(item.id)}>−</button>
              <span style={{ margin: '0 1rem' }}>{cart[item.id]}</span>
              <button style={buttonStyle} onClick={() => onIncrement(item.id)}>+</button>
            </div>
          </div>
          <div><strong>₹{(item.price * cart[item.id]).toFixed(2)}</strong></div>
        </div>
      ))}

      <h3 style={{ marginTop: '2rem' }}>Select Delivery Address</h3>
      {addresses.length === 0 ? (
        <p style={{ color: 'gray' }}>
          No address saved.
          <button
            onClick={() => setShowModal(true)}
            style={{ marginLeft: '1rem', backgroundColor: '#d32f2f', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Address
          </button>
        </p>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          {addresses.map(addr => (
            <label key={addr._id} style={{ display: 'block', margin: '0.5rem 0' }}>
              <input
                type="radio"
                name="address"
                checked={selectedAddressId === addr._id}
                onChange={() => setSelectedAddressId(addr._id)}
                style={{ marginRight: '0.5rem' }}
              />
              {addr.houseNo}, {addr.landmark}, {addr.town}, {addr.state}
            </label>
          ))}

          <button
            onClick={() => setShowModal(true)}
            style={{ marginTop: '1rem', backgroundColor: '#0288d1', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add New Address
          </button>
        </div>
      )}

      {addressError && <div style={{ color: 'red', marginBottom: '1rem' }}>{addressError}</div>}

      <div style={{ textAlign: 'right', marginTop: '2rem' }}>
        <h2>Total: ₹{totalAmount.toFixed(2)}</h2>
        <button
          disabled={!isValidSelectedAddress}
          onClick={handleConfirmOrder}
          title={!isValidSelectedAddress ? 'Please select an address' : ''}
          style={{
            marginTop: '1rem',
            padding: '0.8rem 1.5rem',
            backgroundColor: isValidSelectedAddress ? '#d32f2f' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            cursor: isValidSelectedAddress ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            boxShadow: isValidSelectedAddress ? '0 2px 6px rgba(0, 0, 0, 0.2)' : 'none',
            opacity: isValidSelectedAddress ? 1 : 0.6,
          }}
        >
          Confirm Order
        </button>
      </div>

      {/* Modal for Add Address */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div role="dialog" aria-modal="true" style={{
            backgroundColor: '#fff', padding: '2rem', borderRadius: '8px',
            width: '90%', maxWidth: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}>
            <h2>Add New Address</h2>

            <input
              type="text"
              placeholder="House No"
              value={newAddress.houseNo}
              onChange={e => setNewAddress({ ...newAddress, houseNo: e.target.value })}
              style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
            />
            <input
              type="text"
              placeholder="Landmark"
              value={newAddress.landmark}
              onChange={e => setNewAddress({ ...newAddress, landmark: e.target.value })}
              style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
            />
            <input
              type="text"
              value={newAddress.town}
              readOnly
              style={{
                marginBottom: '1rem',
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#f0f0f0',
                cursor: 'not-allowed',
                color: '#555'
              }}
            />
            <input
              type="text"
              value={newAddress.state}
              readOnly
              style={{
                marginBottom: '1rem',
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#f0f0f0',
                cursor: 'not-allowed',
                color: '#555'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ marginRight: '1rem' }}>Cancel</button>
              <button onClick={handleAddAddress} style={{ backgroundColor: '#0288d1', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default CartPage;
