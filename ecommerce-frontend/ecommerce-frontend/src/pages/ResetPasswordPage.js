import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import theme from '../theme';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('❗ Invalid or missing token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setMessage('🚫 Please fill out both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: newPassword.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(data.msg || '❌ Reset failed. Try again.');
      }
    } catch {
      setMessage('❌ Server error. Try later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '4rem auto',
      padding: '2rem',
      backgroundColor: theme.colors.background,
      borderRadius: '12px',
      boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
      fontFamily: theme.typography?.fontFamily,
      color: theme.colors.text,
      position: 'relative',
    }}>
      <button
        onClick={() => navigate('/login')}
        style={{
          position: 'absolute', top: '1rem', left: '1rem',
          backgroundColor: '#eee', border: `1px solid ${theme.colors.border}`,
          borderRadius: '6px', padding: '0.4rem 0.7rem',
          fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#ddd'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#eee'}
      >
        ⬅ Back
      </button>

      <h2 style={{
        textAlign: 'center', color: theme.colors.primary,
        marginBottom: '1.5rem', fontFamily: theme.typography?.headings,
        fontWeight: '700',
      }}>
        Reset Password
      </h2>

      <form onSubmit={handleSubmit}>
        {/* New Password */}
        <div style={{ marginBottom: '1rem', position: 'relative' }}>
          <label htmlFor="newPass" style={{ fontWeight: '600' }}>
            New Password:
          </label>
          <input
            id="newPass"
            type={showNew ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            style={{
              width: '90%', padding: '0.75rem', marginTop: '0.4rem',
              borderRadius: '8px', border: `1.5px solid ${theme.colors.border}`,
              fontSize: '1rem', transition: 'border-color 0.3s',
              color: theme.colors.text, backgroundColor: theme.colors.background,
            }}
            onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
            onBlur={(e) => e.target.style.borderColor = theme.colors.border}
          />
          {newPassword && (
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              style={{
                position: 'absolute', right: '8%', top: '55%',
                background: 'none', border: 'none',
                color: theme.colors.primary, cursor: 'pointer',
                fontSize: '1.1rem',
              }}
            >{showNew ? <FaEyeSlash /> : <FaEye />}</button>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <label htmlFor="confirmPass" style={{ fontWeight: '600' }}>
            Confirm Password:
          </label>
          <input
            id="confirmPass"
            type={showConfirm ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            style={{
              width: '90%', padding: '0.75rem', marginTop: '0.4rem',
              borderRadius: '8px', border: `1.5px solid ${theme.colors.border}`,
              fontSize: '1rem', transition: 'border-color 0.3s',
              color: theme.colors.text, backgroundColor: theme.colors.background,
            }}
            onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
            onBlur={(e) => e.target.style.borderColor = theme.colors.border}
          />
          {confirmPassword && (
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: 'absolute', right: '8%', top: '55%',
                background: 'none', border: 'none',
                color: theme.colors.primary, cursor: 'pointer',
                fontSize: '1.1rem',
              }}
            >{showConfirm ? <FaEyeSlash /> : <FaEye />}</button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '97%', padding: '0.75rem',
            backgroundColor: theme.colors.primary,
            color: theme.colors.buttonText,
            border: 'none', borderRadius: '10px',
            fontSize: '1.1rem', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '⏳ Saving...' : 'Confirm'}
        </button>
      </form>

      {message && (
        <p style={{
          marginTop: '1.5rem', textAlign: 'center', fontWeight: '600',
          color: message.startsWith('✅') ? 'green' : 'red',
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPasswordPage;
