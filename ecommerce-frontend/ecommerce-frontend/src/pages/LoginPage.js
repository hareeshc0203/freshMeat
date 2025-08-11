import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import theme from '../theme';
import { useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const fromCart = location.state?.fromCart;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Logging in...');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });


      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem(
          'userInfo',
          JSON.stringify({
            email: email.trim(),
            firstname: data.firstname || '',
          })
        );
        window.dispatchEvent(new Event('storage'));
        setMessage('Login successful!');
        setTimeout(() => {
          navigate('/', { state: { justLoggedIn: true, fromCart } });
        }, 1000);
          } else {
            setMessage('Invalid email or password.');
          }
        } catch (err) {
          setMessage('Server error. Please try again later.');
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
        fontFamily: theme.typography?.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: 'relative',
        color: theme.colors.text,
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
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
          fontFamily: theme.typography?.headings || "'Poppins', sans-serif",
          fontWeight: '700',
        }}
      >
        Login
      </h2>


        {fromCart && (
          <div
            style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              border: '1px solid #ffeeba',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
              textAlign: 'center',
            }}
          >
            Just one step! Login or sign up to continue with your order
          </div>
        )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ fontWeight: '600' }}>
            Email:
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: '90%',
              padding: '0.75rem',
              marginTop: '0.4rem',
              borderRadius: '8px',
              border: `1.5px solid ${theme.colors.border}`,
              fontSize: '1rem',
              transition: 'border-color 0.3s',
              color: theme.colors.text,
              backgroundColor: theme.colors.background,
            }}
            onFocus={(e) => (e.target.style.borderColor = theme.colors.primary)}
            onBlur={(e) => (e.target.style.borderColor = theme.colors.border)}
          />
        </div>

        <div style={{ marginBottom: '1rem', position: 'relative' }}>
          <label htmlFor="password" style={{ fontWeight: '600' }}>
            Password:
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: '90%',
              padding: '0.75rem',
              marginTop: '0.4rem',
              borderRadius: '8px',
              border: `1.5px solid ${theme.colors.border}`,
              fontSize: '1rem',
              transition: 'border-color 0.3s',
              color: theme.colors.text,
              backgroundColor: theme.colors.background,
            }}
            onFocus={(e) => (e.target.style.borderColor = theme.colors.primary)}
            onBlur={(e) => (e.target.style.borderColor = theme.colors.border)}
          />

          {password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '8%',
                top: '72%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: theme.colors.primary,
                cursor: 'pointer',
                fontSize: '1.1rem',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>

        <div style={{ textAlign: 'right', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <span
            style={{
              color: theme.colors.primary,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: '500',
            }}
            onClick={() => navigate('/Forget-password')}
          >
            Reset Password?
          </span>
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
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) =>
            !loading && (e.target.style.backgroundColor = theme.colors.secondary)
          }
          onMouseLeave={(e) =>
            !loading && (e.target.style.backgroundColor = theme.colors.primary)
          }
        >
          {loading ? '⏳ Logging in...' : 'Login'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
          <span style={{ color: '#555' }}>New User? </span>
          <span
            onClick={() => navigate('/register')}
            style={{
              color: theme.colors.primary,
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline',
            }}
          >
            Register
          </span>
        </div>
      </form>

      {message && (
        <p
          style={{
            marginTop: '1.5rem',
            color: message.includes('successful') ? 'green' : 'red',
            fontWeight: '600',
            textAlign: 'center',
            opacity: message ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginPage;
