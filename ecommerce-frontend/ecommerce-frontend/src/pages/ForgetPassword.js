import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      const res = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        // Navigate to reset password with token (mocked)
        const token = data.token || 'mocked-reset-token'; // In real scenario, token comes via email
        navigate(`/reset-password?token=${token}`);
      } else {
        setStatusMessage(data.msg || '❌ Failed to send reset link.');
      }
    } catch (err) {
      setStatusMessage('❌ Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem',
        backgroundColor: theme.colors.background,
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: theme.colors.text,
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/login')}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backgroundColor: '#eee',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '6px',
          padding: '0.4rem 0.7rem',
          fontSize: '0.85rem',
          cursor: 'pointer',
          fontWeight: '600',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#ddd')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#eee')}
      >
        ⬅ Back
      </button>

      <h2
        style={{
          textAlign: 'center',
          color: theme.colors.primary,
          marginBottom: '1.5rem',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: '700',
        }}
      >
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ fontWeight: '600' }}>
            Enter your email:
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@example.com"
            style={{
              width: '90%',
              padding: '0.75rem',
              marginTop: '0.4rem',
              borderRadius: '8px',
              border: `1.5px solid ${theme.colors.border}`,
              fontSize: '1rem',
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = theme.colors.primary)
            }
            onBlur={(e) =>
              (e.target.style.borderColor = theme.colors.border)
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '97%',
            padding: '0.75rem',
            backgroundColor: theme.colors.primary,
            color: theme.colors.buttonText,
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Please Wait' : 'Reset Password'}
        </button>
      </form>

      {statusMessage && (
        <p
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontWeight: '600',
            color: statusMessage.includes('✅') ? 'green' : 'red',
          }}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
