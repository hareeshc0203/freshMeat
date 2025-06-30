// src/components/ProfileMenu.js

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
        }}
      >
        👤 Profile
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '1rem',
            borderRadius: '6px',
            zIndex: 1000,
          }}
        >
          <Link to="/login" style={{ display: 'block', marginBottom: '0.5rem' }}>Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
