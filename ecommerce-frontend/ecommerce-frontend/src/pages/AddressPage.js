import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddressPage() {
  const navigate = useNavigate();
  const [houseNo, setHouseNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!houseNo.trim() || !landmark.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to save address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/save-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          houseNo,
          landmark,
          town: "Dharmavaram, Sri Satya Sai Dist, 515671",
          state: "Andhra Pradesh",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        navigate('/order-confirmation');
      } else {
        setError(result.msg || 'Failed to save address.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Delivery Address</h2>

      <label>House/Flat No.</label>
      <input
        type="text"
        placeholder="House/Flat No."
        value={houseNo}
        onChange={(e) => setHouseNo(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
      />

      <label>Landmark</label>
      <input
        type="text"
        placeholder="Landmark"
        value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
      />

      <label>Town</label>
      <div style={{ padding: '8px', backgroundColor: '#f3f3f3', marginBottom: '1rem' }}>
        Dharmavaram, Sri Satya Sai Dist, 515671
      </div>

      <label>State</label>
      <div style={{ padding: '8px', backgroundColor: '#f3f3f3', marginBottom: '1rem' }}>
        Andhra Pradesh
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <button
        onClick={handleSave}
        style={{
          backgroundColor: '#d32f2f',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Save & Continue
      </button>
    </div>
  );
}

export default AddressPage;
