import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    mobile: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [serverMessage, setServerMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validatePassword = (pwd) => {
     const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\]{};':"\\|,.<>/?]{8,20}$/;
    return pattern.test(pwd);
  };

  useEffect(() => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be 8–20 characters, include A-Z, a-z, 0–9   and no spaces.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [firstName, lastName, mobile, email, password, confirmPassword]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Mark all fields touched on submit to show all errors if any
    setTouched({
      firstName: true,
      lastName: true,
      mobile: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) return;

    try {
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          mobile: mobile,
          email: email,
          password: password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setServerMessage('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setServerMessage(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setServerMessage('Server error. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.8rem',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    marginTop: '0.3rem',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  };

  const errorTextStyle = {
    color: 'red',
    fontSize: '0.875rem',
    marginTop: '0.3rem',
  };

  const iconStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '1.2rem',
    userSelect: 'none',
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '3rem auto',
        padding: '2rem',
        backgroundColor: '#f0f4f8',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ color: '#333', marginBottom: '1.5rem', textAlign: 'center' }}>Register</h2>

      <form onSubmit={handleRegister}>
        {/* First & Last Name */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '2rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ flex: 1 }}>
            <label htmlFor="firstName" style={{ color: '#555', fontWeight: '600' }}>
              First Name<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="First name"
              style={inputStyle}
              aria-invalid={!!errors.firstName}
              aria-describedby="firstNameError"
            />
            {touched.firstName && errors.firstName && (
              <div id="firstNameError" style={errorTextStyle}>
                {errors.firstName}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <label htmlFor="lastName" style={{ color: '#555', fontWeight: '600' }}>
              Last Name<span style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Last name"
              style={inputStyle}
              aria-invalid={!!errors.lastName}
              aria-describedby="lastNameError"
            />
            {touched.lastName && errors.lastName && (
              <div id="lastNameError" style={errorTextStyle}>
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Number */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="mobile" style={{ color: '#555', fontWeight: '600' }}>
            Mobile Number<span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                padding: '0.6rem 1rem',
                backgroundColor: '#e0e0e0',
                border: '1.5px solid #ccc',
                borderRadius: '6px 0 0 6px',
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              +91
            </span>
            <input
              id="mobile"
              type="text"
              maxLength={10}
              value={mobile}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,10}$/.test(val)) {
                  setMobile(val);
                }
              }}
              onBlur={() => handleBlur('mobile')}
              placeholder="Enter 10-digit mobile number"
              style={{
                ...inputStyle,
                borderRadius: '0 6px 6px 0',
                marginTop: 0,
                borderLeft: 'none',
              }}
              aria-invalid={!!errors.mobile}
              aria-describedby="mobileError"
            />
          </div>
          {touched.mobile && errors.mobile && (
            <div id="mobileError" style={errorTextStyle}>
              {errors.mobile}
            </div>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ color: '#555', fontWeight: '600' }}>
            Email<span style={{ color: 'red' }}>*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="you@example.com"
            style={inputStyle}
            aria-invalid={!!errors.email}
            aria-describedby="emailError"
          />
          {touched.email && errors.email && (
            <div id="emailError" style={errorTextStyle}>
              {errors.email}
            </div>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="password" style={{ color: '#555', fontWeight: '600' }}>
            Password<span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Enter strong password"
              maxLength={20}
              style={inputStyle}
              aria-invalid={!!errors.password}
              aria-describedby="passwordError"
            />
            {password.length > 0 && (
              <span onClick={() => setShowPassword((prev) => !prev)} style={iconStyle}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            )}
          </div>
          {touched.password && errors.password && (
            <div id="passwordError" style={errorTextStyle}>
              {errors.password}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '1.8rem' }}>
          <label htmlFor="confirmPassword" style={{ color: '#555', fontWeight: '600' }}>
            Confirm Password<span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Re-enter password"
              maxLength={20}
              style={inputStyle}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby="confirmPasswordError"
            />
            {confirmPassword.length > 0 && (
              <span onClick={() => setShowConfirmPassword((prev) => !prev)} style={iconStyle}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            )}
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <div id="confirmPasswordError" style={errorTextStyle}>
              {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isFormValid ? '#007bff' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s',
          }}
        >
          Register
        </button>

        {/* Server response */}
        {serverMessage && (
          <p style={{ textAlign: 'center', color: serverMessage.includes('successful') ? 'green' : 'red', marginTop: '1rem' }}>
            {serverMessage}
          </p>
        )}

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
          <span style={{ color: '#555' }}>Already Registered? </span>
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#007bff',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline',
            }}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
